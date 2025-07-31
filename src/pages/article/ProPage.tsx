import { useFetchArticleDetail } from "@/services/article";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";

import FeatureCards from "@/resources/images/features/feature_cards.svg";
import ExportTable from "@/resources/images/features/export_table.svg";
import FeatureData from "@/resources/images/features/feature_data.svg";
import FeatureGovernance from "@/resources/images/features/feature_governance.svg";

import { useEffect, useRef } from "react";
import { useNotFound } from "@/stores/useNotFound";
import { webUrl } from "@/constants/confVariables";

export const ProPage = () => {
  const query = useFetchArticleDetail("en", "page", "pro");
  const data = query.data;
  const name = data?.name;
  const description = data?.description;
  const keywords = data?.keywords;

  const { setNotFound } = useNotFound();

  useEffect(() => {
    if (!data?.data || data.data.length === 0) {
      setNotFound(true);
    }
  }, [data, setNotFound]);

  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const featureCardsImg = document.getElementById("feature_cards");
    const exportTableImg = document.getElementById("export_table");
    const featureDataImg = document.getElementById("feature_data");
    const featureGovernance = document.getElementById("feature_governance");
    const exportTableMobileImg = document.getElementById(
      "export_table--mobile",
    );
    const featureGovernanceMobileImg = document.getElementById(
      "feature_governance--img",
    );

    if (exportTableMobileImg instanceof HTMLImageElement) {
      exportTableMobileImg.src = ExportTable;
    }

    if (featureCardsImg instanceof HTMLImageElement) {
      featureCardsImg.src = FeatureCards;
    }

    if (exportTableImg instanceof HTMLImageElement) {
      exportTableImg.src = ExportTable;
    }

    if (featureDataImg instanceof HTMLImageElement) {
      featureDataImg.src = FeatureData;
    }

    if (featureGovernance instanceof HTMLImageElement) {
      featureGovernance.src = FeatureGovernance;
    }

    if (featureGovernanceMobileImg instanceof HTMLImageElement) {
      featureGovernanceMobileImg.src = FeatureGovernance;
    }
  }, [data]);

  useEffect(() => {
    if (!accordionRef.current) {
      return;
    }

    const accordionElement = accordionRef.current;
    const triggers = accordionElement.querySelectorAll(".accordion-trigger");
    triggers.forEach(trigger => {
      trigger.addEventListener("click", toggleAccordion);
    });

    function toggleAccordion(event) {
      const trigger = event.currentTarget;
      const accordionItem = trigger.parentElement;
      const content = accordionItem.querySelector(".accordion-content");
      const icon = trigger.querySelector(".chevron-icon");

      const allContents =
        accordionElement.querySelectorAll(".accordion-content");
      const allIcons = accordionElement.querySelectorAll(".chevron-icon");
      allContents.forEach(item => {
        if (item !== content) {
          (item as HTMLDivElement).style.maxHeight = "0px";
          item.classList.remove("open");
        }
      });
      allIcons.forEach(iconItem => {
        if (iconItem !== icon) {
          (iconItem as HTMLDivElement).style.transform = "rotate(0deg)";
        }
      });

      if (content.classList.contains("open")) {
        content.style.maxHeight = null;
        content.classList.remove("open");
        icon.style.transform = "rotate(0deg)";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.classList.add("open");
        icon.style.transform = "rotate(180deg)";
      }
    }

    return () => {
      if (accordionElement) {
        const triggers =
          accordionElement.querySelectorAll(".accordion-trigger");
        triggers.forEach(trigger => {
          trigger.removeEventListener("click", toggleAccordion);
        });
      }
    };
  }, [data]);

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        {description && <meta name='description' content={description} />}
        {keywords && <meta name='keywords' content={keywords} />}
        {name && <title>{name}</title>}
        {name && <meta property='og:title' content={name} />}
        {description && (
          <meta property='og:description' content={description} />
        )}
        <meta property='og:type' content='website' />
        <meta property='og:url' content={webUrl + location.pathname} />
      </Helmet>
      <main
        ref={accordionRef}
        className='flex min-h-minHeight w-full flex-col items-center px-mobile md:px-desktop'
      >
        {parse(data?.data.map(item => item).join("") || "")}
      </main>
    </>
  );
};
