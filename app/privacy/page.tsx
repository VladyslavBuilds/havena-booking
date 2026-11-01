import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { List, Section } from "../components/LegalPage";
import { OPERATOR, SITE } from "../libs/legal";

export const metadata: Metadata = {
    title: "Privacy Policy",
};

const PrivacyPage = () => {
    return (
        <LegalPage
            title="Privacy Policy"
            subtitle={`How ${SITE.name} handles personal data`}
        >
            <Section title="1. Who is responsible">
                <p>
                    The controller within the meaning of the GDPR is {OPERATOR.name}
                    {" "}(see the <Link href="/imprint" className="underline">Imprint</Link>).
                    Questions about your data:{" "}
                    <a href={`mailto:${OPERATOR.email}`} className="underline">{OPERATOR.email}</a>.
                </p>
            </Section>

            <Section title="2. What this site is">
                <p>
                    {SITE.name} is a non-commercial portfolio project that demonstrates a
                    booking platform. There are no real stays and no payments. Accounts and
                    content exist for demonstration only and may be deleted or reset at any time.
                    Please do not enter data you would not want in a demo system.
                </p>
            </Section>

            <Section title="3. Data we process">
                <List items={[
                    <><strong>Account with e-mail and password:</strong> your e-mail address, the name you enter and a hash of your password (bcrypt). The password itself is never stored.</>,
                    <><strong>Account via GitHub or Google:</strong> your name, e-mail address, profile picture URL and the account identifier the provider gives us. We never see your GitHub or Google password.</>,
                    <><strong>Content you create:</strong> listings (title, description, country, photo), reservations (dates, total price), reviews, favourites.</>,
                    <><strong>Technical data:</strong> the hosting provider records server logs (IP address, time, requested URL, browser type) for a short period to keep the service secure and to diagnose errors.</>,
                ]} />
            </Section>

            <Section title="4. Why and on which legal basis">
                <List items={[
                    <>Running your account and showing your content: performance of the service you asked for (Art. 6(1)(b) GDPR).</>,
                    <>Security, error diagnosis and preventing abuse: our legitimate interest in a working, safe site (Art. 6(1)(f) GDPR).</>,
                ]} />
                <p>We do not use your data for advertising, profiling or tracking.</p>
            </Section>

            <Section title="5. Cookies and local storage">
                <p>
                    The site sets only cookies that are strictly necessary for signing in,
                    which do not require consent (§ 25(2) TDDDG). No analytics or marketing
                    cookies are used, which is why there is no cookie banner.
                </p>
                <List items={[
                    <><code>next-auth.session-token</code>: keeps you signed in (30 days, or until you log out).</>,
                    <><code>next-auth.csrf-token</code> and <code>next-auth.callback-url</code>: protect the sign-in process; set only while you sign in.</>,
                    <>Your light/dark theme choice is kept in the browser&apos;s local storage and never sent to us.</>,
                ]} />
            </Section>

            <Section title="6. Service providers and third parties">
                <p>The site relies on the following providers. Some of them are based in the USA, so your data may be processed outside the EU.</p>
                <List items={[
                    <><strong>Vercel Inc.</strong> (USA): hosting and server logs.</>,
                    <><strong>MongoDB Inc.</strong> (USA): the database (MongoDB Atlas) that stores accounts and content.</>,
                    <><strong>Cloudinary Ltd.</strong> (Israel/USA): storage of listing photos. Photos are uploaded from your browser directly to Cloudinary.</>,
                    <><strong>GitHub Inc.</strong> and <strong>Google LLC</strong> (USA): only if you choose to sign in with them; their own privacy policies apply to that step.</>,
                    <><strong>OpenStreetMap Foundation</strong> (UK) and <strong>Esri Inc.</strong> (USA): map images. When a map is shown, your browser loads the tiles from their servers, which transmits your IP address to them.</>,
                ]} />
            </Section>

            <Section title="7. How long we keep data">
                <p>
                    Account data and content are kept while your account exists. As a demo
                    system, the database may be reset at any time, which deletes all accounts
                    and content. You can ask for deletion of your account at any time by e-mail.
                    Server logs are kept by the hosting provider for a short period only.
                </p>
            </Section>

            <Section title="8. Your rights">
                <p>
                    Under the GDPR you have the right to access, rectify and erase your data,
                    to restrict or object to its processing, to data portability, and to lodge a
                    complaint with a data protection supervisory authority. To exercise these
                    rights, write to{" "}
                    <a href={`mailto:${OPERATOR.email}`} className="underline">{OPERATOR.email}</a>.
                </p>
            </Section>

            <Section title="9. Changes">
                <p>
                    This policy may be updated when the site changes. The date of the last
                    change is shown at the top of this page.
                </p>
            </Section>
        </LegalPage>
    );
};

export default PrivacyPage;
