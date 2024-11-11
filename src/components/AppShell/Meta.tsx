type MetaProps = {
    title: string;
    keywords: string;
    description: string;
};
export default function Meta({ title, keywords, description }: MetaProps) {
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{title}</title>
            <meta name="keywords" content={keywords} />
            <meta name="description" content={description} />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
        </head>
    );
}
