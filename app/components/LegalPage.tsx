import Container from "./Container";
import Heading from "./Heading";
import { LEGAL_UPDATED } from "../libs/legal";

interface LegalPageProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

// Shared frame for the imprint, privacy policy and terms: a heading, the
// "last updated" line and a readable text column.
const LegalPage: React.FC<LegalPageProps> = ({ title, subtitle, children }) => {
    return (
        <Container>
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <Heading title={title} subtitle={subtitle} />
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Last updated: {LEGAL_UPDATED}
                    </div>
                </div>
                <div className="flex flex-col gap-8 font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {children}
                </div>
            </div>
        </Container>
    );
};

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                {title}
            </h2>
            {children}
        </section>
    );
};

export const List: React.FC<{ items: React.ReactNode[] }> = ({ items }) => {
    return (
        <ul className="list-disc pl-6 flex flex-col gap-2">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
};

export default LegalPage;
