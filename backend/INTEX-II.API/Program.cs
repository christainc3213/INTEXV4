using System.Security.Claims;
using INTEX_II.API.Data;
using INTEX_II.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DATABASES
builder.Services.AddDbContext<MainDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MainDbConnection")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddDbContext<InteractionDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("InteractionConnection")));

// IDENTITY
builder.Services.AddAuthorization();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<IdentityUser>, CustomUserClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader()
                .WithExposedHeaders("Content-Security-Policy");
        });
});

builder.Services.AddSingleton<IEmailSender<IdentityUser>, NoOpEmailSender<IdentityUser>>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        Path = "/",
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

app.MapGet("/pingauth", (HttpContext context, ClaimsPrincipal user) =>
{
    Console.WriteLine($"User authenticated? {user.Identity?.IsAuthenticated}");

    if (!user.Identity?.IsAuthenticated ?? false)
    {
        Console.WriteLine("Unauthorized request to /pingauth");
        return Results.Unauthorized();
    }

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    Console.WriteLine($"Authenticated User Email: {email}");

    return Results.Json(new { email = email });
});

app.Run();
