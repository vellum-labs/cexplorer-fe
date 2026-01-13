import { PageBase } from "@/components/global/pages/PageBase";
import { Download } from "lucide-react";
import LogoMark from "@/resources/images/cexLogo.svg";
import DarkIcon from "@/resources/images/navbar_logo_dark.svg";
import LightIcon from "@/resources/images/navbar_logo_light.svg";
import { Link } from "@tanstack/react-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

const logosConfig = [
  {
    id: "logomark",
    nameKey: "brandPage.logos.logomark",
    image: LogoMark,
    filename: "logomark",
  },
  {
    id: "light",
    nameKey: "brandPage.logos.light",
    image: LightIcon,
    filename: "light-icon",
  },
  {
    id: "dark",
    nameKey: "brandPage.logos.dark",
    image: DarkIcon,
    filename: "dark-icon",
  },
];

const colorsConfig = [
  {
    nameKey: "brandPage.colors.red",
    hex: "#E4003a",
    background: "#E4003a",
  },
  {
    nameKey: "brandPage.colors.white",
    hex: "#E4E7EC",
    background: "#E4E7EC",
  },
  {
    nameKey: "brandPage.colors.black",
    hex: "#101828",
    background: "#101828",
  },
  {
    nameKey: "brandPage.colors.blue",
    hex: "#0094D4",
    background: "#0094D4",
  },
  {
    nameKey: "brandPage.colors.proGradient",
    hex: ["#6A11CB", "#2575FC"],
    background: "linear-gradient(270deg, #6A11CB 0%, #2575FC 100%)",
  },
];

const handleDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const BrandAssetsPage = () => {
  const { t } = useAppTranslation();

  return (
    <PageBase
      metadataOverride={{ title: t("brandPage.metaTitle") }}
      title={t("brandPage.title")}
      breadcrumbItems={[{ label: t("brandPage.breadcrumb") }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-12 px-mobile pb-3 md:px-desktop'>
        <div className='flex w-full max-w-[800px] flex-col items-center text-center'>
          <p className='text-base text-muted-foreground'>
            {t("brandPage.description")}
          </p>
        </div>

        <div className='flex w-full max-w-[800px] flex-col items-center'>
          <h2 className='text-2xl mb-2 font-semibold'>{t("brandPage.guidelines.title")}</h2>
          <p className='text-base text-muted-foreground mb-3'>
            {t("brandPage.guidelines.description")}
          </p>
          <ul className='text-sm text-muted-foreground w-full list-inside list-disc space-y-1 text-start'>
            <li>{t("brandPage.guidelines.items.reference")}</li>
            <li>{t("brandPage.guidelines.items.noAlterations")}</li>
            <li>{t("brandPage.guidelines.items.contrast")}</li>
            <li>{t("brandPage.guidelines.items.noCombine")}</li>
            <li>{t("brandPage.guidelines.items.noEndorsement")}</li>
            <li>{t("brandPage.guidelines.items.noUnlawful")}</li>
            <li>
              {t("brandPage.guidelines.items.dataReference")}{" "}
              <Link to='/' className='text-primary hover:underline'>
                Cexplorer.io
              </Link>
              :
            </li>
            <li className='pl-6'>"{t("brandPage.guidelines.items.dataProvidedBy")}"</li>
            <li className='pl-6'>"{t("brandPage.guidelines.items.source")}"</li>
          </ul>
          <p className='text-sm text-muted-foreground mt-3'>
            {t("brandPage.guidelines.apiNote")}
          </p>
        </div>

        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h2 className='text-2xl mb-8 font-semibold'>{t("brandPage.logos.title")}</h2>
          <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {logosConfig.map(logo => (
              <div
                key={logo.id}
                className='flex flex-col gap-3 rounded-xl border border-border p-4'
              >
                <div className='flex h-48 items-center justify-center rounded-xl bg-darker'>
                  <img
                    src={logo.image}
                    alt={t(logo.nameKey)}
                    className='max-h-[40px] max-w-[200px]'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <span className='font-semibold'>{t(logo.nameKey)}</span>
                  <div className='flex items-end justify-between pb-2'>
                    <span className='text-sm text-muted-foreground'>
                      Png, Svg
                    </span>
                    <button
                      onClick={() => handleDownload(logo.image, logo.filename)}
                      className='hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-border'
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h2 className='text-2xl mb-8 font-semibold'>{t("brandPage.colors.title")}</h2>
          <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {colorsConfig.map((color, index) => (
              <div
                key={index}
                className='flex flex-col gap-3 rounded-xl border border-border p-4'
              >
                <div
                  className='h-24 w-full rounded-xl'
                  style={{ background: color.background }}
                />
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{t(color.nameKey)}</span>
                  {Array.isArray(color.hex) ? (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        {color.hex[0]}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        {color.hex[1]}
                      </span>
                    </div>
                  ) : (
                    <span className='text-sm text-muted-foreground'>
                      {color.hex}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageBase>
  );
};
