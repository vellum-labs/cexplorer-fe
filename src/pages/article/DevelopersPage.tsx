import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

import { useEffect } from "react";
import { LoadingSkeleton } from "@vellumlabs/cexplorer-sdk";

export const DevelopersPage = () => {
  const query = useFetchArticleDetail("en", "page", "developers");
  const data = query.data;
  const name = data?.name;

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
      <Helmet>{name && <title>{name} | Cexplorer.io</title>}</Helmet>
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
