import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

import { useEffect } from "react";
import { webUrl } from "@/constants/confVariables";
import { useNotFound } from "@/stores/useNotFound";

export const DevelopersPage = () => {
  const query = useFetchArticleDetail("en", "page", "developers");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  const { setNotFound } = useNotFound();

  useEffect(() => {
    if (!query.data || !query.data.data || query.data.data.length === 0) {
      setNotFound(true);
    }
  }, [query.data, setNotFound]);

  useEffect(() => {
    const buttons = document.querySelectorAll(".tabs--btn");
    const domain = document.querySelector(".card--table__header--domain");

    if (!buttons || !domain) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const handleButton = (button: Element) => {
      button.addEventListener(
        "click",
        () => {
          buttons.forEach(btn => btn.classList.remove("tabs--active"));
          button.classList.add("tabs--active");

          switch (button.innerHTML) {
            case "Mainnet":
              domain.innerHTML = "Domain: cexplorer.io";
              break;
            case "Preprod":
              domain.innerHTML = "Domain: preprod.cexplorer.io";
              break;
            default:
              domain.innerHTML = "Domain: preview.cexplorer.io";
              break;
          }
        },
        { signal },
      );
    };

    buttons.forEach(button => handleButton(button));

    return () => {
      controller.abort();
    };
  }, [data]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name} | Cexplorer.io</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main className='flex min-h-minHeight w-full flex-col items-center p-mobile md:p-desktop'>
        {parse(data?.data.map(item => item).join("") || "")}
      </main>
    </>
  );
};
