import { codeToHtml } from "shiki";
import type { BundledTheme } from "shiki"; // Import the types from shiki

type Props = {
    children: string;
    className?: string;
    theme?: BundledTheme;
};

export default async function Code({ children, className, theme = "slack-dark" }: Props) {

    let lang = className?.replace('lang-', '') || 'shell';

    const html = await codeToHtml(children, {
        lang,
        theme,
    });

    return (
          <div className="overflow-hidden rounded-md my-4">
            <div
              className=" [&>pre]:overflow-x-auto  [&>pre]:py-3 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug"
              dangerouslySetInnerHTML={{ __html: html }}
            ></div>
        </div>
      );
}
