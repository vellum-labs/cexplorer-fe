import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

import { useEffect } from "react";
import { webUrl } from "@/constants/confVariables";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const DevelopersPage = () => {
  const query = useFetchArticleDetail("en", "page", "developers");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

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
        {query.isLoading ? (
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col items-center gap-2'>
              <LoadingSkeleton width='150px' height='30px' />
              <LoadingSkeleton width='300px' height='20px' />
            </div>
            <LoadingSkeleton width='800px' height='206px' rounded='lg' />
            <LoadingSkeleton width='800px' height='206px' rounded='lg' />
            <LoadingSkeleton width='800px' height='792px' rounded='lg' />
          </div>
        ) : (
          parse(data?.data.map(item => item).join("") || "")
        )}
      </main>
    </>
  );
};
