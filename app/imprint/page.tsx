import type { Metadata } from "next";

import LegalPage, { Section } from "../components/LegalPage";
import { OPERATOR, SITE } from "../libs/legal";

export const metadata: Metadata = {
    title: "Imprint",
};

const ImprintPage = () => {
    return (
        <LegalPage
            title="Imprint (Impressum)"
            subtitle={`Information pursuant to § 5 DDG for ${SITE.name}`}
        >
            <Section title="Operator">
                <p>
                    {SITE.name} is a private, non-commercial portfolio project.
                    It is run by:
                </p>
                <address className="not-italic">
                    {OPERATOR.name}<br />
                    {OPERATOR.address.length > 0 ? (
                        <>
                            {OPERATOR.address.map((line) => (
                                <span key={line}>{line}<br /></span>
                            ))}
                        </>
                    ) : (
                        <>Postal address available on request<br /></>
                    )}
                    {OPERATOR.country}
                </address>
            </Section>

            <Section title="Contact">
                <p>
                    E-mail:{" "}
                    <a href={`mailto:${OPERATOR.email}`} className="underline">
                        {OPERATOR.email}
                    </a>
                </p>
            </Section>

            <Section title="Responsible for the content">
                <p>{OPERATOR.name}, address as above.</p>
            </Section>

            <Section title="Purpose of this site">
                <p>
                    This site demonstrates a booking platform built with Next.js.
                    The listings are fictional or test data; no accommodation is
                    offered, no bookings are binding and no payments are taken.
                    The source code is available on{" "}
                    <a href={SITE.repo} target="_blank" rel="noreferrer" className="underline">
                        GitHub
                    </a>.
                </p>
            </Section>

            <Section title="Credits">
                <p>
                    Demo photos from Unsplash. Map data © OpenStreetMap contributors;
                    dark basemap © Esri. Icons from react-icons.
                </p>
            </Section>
        </LegalPage>
    );
};

export default ImprintPage;
