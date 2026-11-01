import type { Metadata } from "next";
import Link from "next/link";

import LegalPage, { List, Section } from "../components/LegalPage";
import { OPERATOR, SITE } from "../libs/legal";

export const metadata: Metadata = {
    title: "Terms of Use",
};

const TermsPage = () => {
    return (
        <LegalPage
            title="Terms of Use"
            subtitle={`The rules for using ${SITE.name}`}
        >
            <Section title="1. What you are using">
                <p>
                    {SITE.name} is a portfolio project by {OPERATOR.name}{" "}
                    that demonstrates a booking platform. It is not a real marketplace: the listings are fictional
                    or test data, no accommodation is offered, &quot;reservations&quot; do not create
                    any contract between users, and no payments are taken. The site is
                    provided free of charge, for demonstration and evaluation.
                </p>
            </Section>

            <Section title="2. Accounts">
                <List items={[
                    <>You may create an account with an e-mail address and password or sign in with GitHub or Google. Keep your password to yourself.</>,
                    <>Use real contact data only if you are comfortable with it being in a demo system; see the <Link href="/privacy" className="underline">Privacy Policy</Link>.</>,
                    <>Because this is a demo, accounts and content may be deleted or reset at any time without notice. You can also ask for your account to be deleted by e-mail.</>,
                ]} />
            </Section>

            <Section title="3. Your content">
                <List items={[
                    <>You keep all rights to the texts and photos you add. You allow {SITE.name} to store and display them as part of the demo.</>,
                    <>Upload only photos and texts you own or are allowed to use, and no personal data of other people.</>,
                    <>Content that is illegal, offensive, misleading or unrelated to the purpose of the demo may be removed without notice.</>,
                ]} />
            </Section>

            <Section title="4. Fair use">
                <p>
                    Do not try to disrupt the service, gain access to other accounts, send
                    automated traffic, or use the site for anything other than trying it out.
                    Security findings are welcome by e-mail.
                </p>
            </Section>

            <Section title="5. No warranty, limited liability">
                <p>
                    The site is provided &quot;as is&quot;, without any warranty of availability,
                    accuracy or fitness for a purpose. To the extent permitted by law,
                    liability is excluded except for intent, gross negligence, injury to life,
                    body or health, and mandatory statutory liability.
                </p>
            </Section>

            <Section title="6. Applicable law and changes">
                <p>
                    German law applies. These terms may change when the site changes; the
                    date of the last change is shown at the top. Contact:{" "}
                    <a href={`mailto:${OPERATOR.email}`} className="underline">{OPERATOR.email}</a>.
                </p>
            </Section>
        </LegalPage>
    );
};

export default TermsPage;
