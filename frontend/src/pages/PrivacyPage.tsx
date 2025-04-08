import BrowseNavbar from "../components/Header/BrowseNavbar";
import HeaderLink from "../components/Header/HeaderLink";
import Logo from "../components/Header/Logo";

const PrivacyPage = () => {
    return (
        <>
            {/* Temporarily comment out BrowseNavbar until it's created */}
            {/* <BrowseNavbar> */}
            <div className="bg-dark w-100 pt-4 pb-4 ps-5">
                <Logo />
            </div>
            {/* </BrowseNavbar> */}

            <div className="container py-5">
                <h1 className="text-center">Privacy Policy for CineNiche</h1>
                <div className="text-start">
                    <p>
                        <strong>Effective Date:</strong> <i>April 7, 2025</i>
                    </p>

                    <p>
                        At CineNiche, your privacy is important to us. This Privacy Policy
                        explains how we collect, use, and protect your personal information
                        when you use our web application.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        When you use CineNiche, we may collect the following types of
                        personal information:
                    </p>
                    <ul>
                        <li><strong>Location Data:</strong> City, State, ZIP code</li>
                        <li><strong>Demographic Data:</strong> Age, Gender</li>
                        <li><strong>Preference Data:</strong> The shows you like, viewing history, and interaction behavior</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect for purposes such as:</p>
                    <ul>
                        <li>Personalizing your content experience</li>
                        <li>Generating machine learning-based recommendations tailored to your interests</li>
                        <li>Improving our features, user experience, and recommendation models</li>
                        <li>Analyzing trends and user engagement across the platform</li>
                    </ul>

                    <h2>3. Data Sharing and Disclosure</h2>
                    <p>
                        We do not sell or rent your personal information to third parties.
                        We may share aggregated, non-identifiable data for analytics and
                        business insights. Personal data may only be shared with trusted
                        service providers who help us operate CineNiche and are bound by
                        confidentiality obligations.
                    </p>

                    <h2>4. Data Security</h2>
                    <p>
                        We take appropriate security measures to protect your information
                        from unauthorized access, loss, misuse, or alteration. These include
                        encryption, access controls, and secure data storage practices.
                    </p>

                    <h2>5. Your Choices</h2>
                    <p>You may:</p>
                    <ul>
                        <li>Update or correct your personal information through your account settings</li>
                        <li>Request deletion of your account and associated data</li>
                        <li>Opt out of personalized recommendations (note: this may affect your experience on CineNiche)</li>
                    </ul>

                    <h2>6. Children’s Privacy</h2>
                    <p>
                        CineNiche is not intended for users under the age of 13. We do not
                        knowingly collect personal information from children under 13. If we
                        learn that we have done so, we will take steps to delete the data
                        promptly.
                    </p>

                    <h2>7. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. If significant
                        changes are made, we will notify you through the app or via email.
                        Continued use of CineNiche after such changes indicates your
                        acceptance of the updated policy.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or your data, please contact us at:</p>
                    <p><strong>Email:</strong> support@cineniche.com</p>
                </div>
            </div>
        </>
    );
};

export default PrivacyPage;
