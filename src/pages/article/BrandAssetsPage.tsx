import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

import LogoMark from "@/resources/images/cexLogo.svg";
import DarkIcon from "@/resources/images/navbar_logo_dark.svg";
import LightIcon from "@/resources/images/navbar_logo_light.svg";
import { webUrl } from "@/constants/confVariables";
import { useNotFound } from "@/stores/useNotFound";

export const BrandAssetsPage = () => {
  const query = useFetchArticleDetail("en", "page", "brand-assets");
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
    const logomark = document.getElementById("logomark") as HTMLImageElement;
    const lightIcon = document.getElementById("lightIcon") as HTMLImageElement;
    const darkIcon = document.getElementById("darkIcon") as HTMLImageElement;
    const logomarkBtn = document.getElementById(
      "logomark-btn",
    ) as HTMLButtonElement;
    const lightIconBtn = document.getElementById(
      "light-icon-btn",
    ) as HTMLButtonElement;
    const darkIconBtn = document.getElementById(
      "dark-icon-btn",
    ) as HTMLButtonElement;

    if (logomark) logomark.src = LogoMark;
    if (lightIcon) lightIcon.src = LightIcon;
    if (darkIcon) darkIcon.src = DarkIcon;

    const handleLogo = (url: string, name: string) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const controller = new AbortController();
    const signal = controller.signal;

    const logomarkClickHandler = () => handleLogo(LogoMark, "logomark");
    const lightIconClickHandler = () => handleLogo(LightIcon, "light-icon");
    const darkIconClickHandler = () => handleLogo(DarkIcon, "dark-icon");

    if (logomarkBtn) {
      logomarkBtn.addEventListener("click", logomarkClickHandler, {
        signal,
      });
    }

    if (lightIconBtn) {
      lightIconBtn.addEventListener("click", lightIconClickHandler, {
        signal,
      });
    }

    if (darkIconBtn) {
      darkIconBtn.addEventListener("click", darkIconClickHandler, {
        signal,
      });
    }

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
