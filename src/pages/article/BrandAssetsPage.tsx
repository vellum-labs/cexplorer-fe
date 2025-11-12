import { PageBase } from "@/components/global/pages/PageBase";
import { Download } from "lucide-react";
import LogoMark from "@/resources/images/cexLogo.svg";
import DarkIcon from "@/resources/images/navbar_logo_dark.svg";
import LightIcon from "@/resources/images/navbar_logo_light.svg";
import { Link } from "@tanstack/react-router";

const logos = [
  {
    id: "logomark",
    name: "Logomark",
    image: LogoMark,
    filename: "logomark",
  },
  {
    id: "light",
    name: "Light",
    image: LightIcon,
    filename: "light-icon",
  },
  {
    id: "dark",
    name: "Dark",
    image: DarkIcon,
    filename: "dark-icon",
  },
];

const colors = [
  {
    name: "Red",
    hex: "#E4003a",
    background: "#E4003a",
  },
  {
    name: "White",
    hex: "#E4E7EC",
    background: "#E4E7EC",
  },
  {
    name: "Black",
    hex: "#101828",
    background: "#101828",
  },
  {
    name: "Blue",
    hex: "#0094D4",
    background: "#0094D4",
  },
  {
    name: "PRO gradient",
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
  return (
    <PageBase
      metadataOverride={{ title: "Brand assets | Cexplorer.io" }}
      title='Brand assets'
      breadcrumbItems={[{ label: "Brand assets" }]}
      adsCarousel={false}
      customPage={true}
    >
      <section className='flex w-full max-w-desktop flex-col items-center gap-12 px-mobile pb-3 md:px-desktop'>
        <div className='flex w-full max-w-[800px] flex-col items-center text-center'>
          <p className='text-base text-muted-foreground'>
            For using Cexplorer.io branding in press on graphics materials.
          </p>
        </div>

        <div className='flex w-full max-w-[800px] flex-col items-center'>
          <h2 className='text-2xl mb-2 font-semibold'>Guidelines</h2>
          <p className='text-base text-muted-foreground mb-3'>
            These guidelines ensure consistent and proper use of the Cexplorer
            name and logo. By following them, you help maintain our brand's
            integrity and clarity across all platforms.
          </p>
          <ul className='text-sm text-muted-foreground w-full list-inside list-disc space-y-1 text-start'>
            <li>
              Always use "Cexplorer" or "Cexplorer.io" when referencing our
              brand.
            </li>
            <li>
              Use the Cexplorer logo as provided, without any alterations or
              modifications.
            </li>
            <li>
              Ensure you choose the appropriate logo variant to maintain clear
              contrast with the background.
            </li>
            <li>
              Do not combine the Cexplorer logo with other images or logos
              without prior consent.
            </li>
            <li>
              Do not use the Cexplorer name or logo in any way that implies
              endorsement, affiliation, or partnership without permission.
            </li>
            <li>
              Avoid using the Cexplorer brand in association with any unlawful
              activities, promotions, or products.
            </li>
            <li>
              If you're using data from Cexplorer, be sure to reference it
              clearly with a direct link to{" "}
              <Link to='/' className='text-primary hover:underline'>
                Cexplorer.io
              </Link>
              :
            </li>
            <li className='pl-6'>"Data provided by Cexplorer"</li>
            <li className='pl-6'>"Source: Cexplorer"</li>
          </ul>
          <p className='text-sm text-muted-foreground mt-3'>
            Note: API data usage is allowed only if you have valid license for
            specific use-case (NOT end-consumer frontend license)
          </p>
        </div>

        <div className='flex w-full max-w-desktop flex-col items-center'>
          <h2 className='text-2xl mb-8 font-semibold'>Logos</h2>
          <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {logos.map(logo => (
              <div
                key={logo.id}
                className='flex flex-col gap-3 rounded-xl border border-border p-4'
              >
                <div className='flex h-48 items-center justify-center rounded-xl bg-darker'>
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className='max-h-[40px] max-w-[200px]'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <span className='font-semibold'>{logo.name}</span>
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
          <h2 className='text-2xl mb-8 font-semibold'>Colors</h2>
          <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {colors.map((color, index) => (
              <div
                key={index}
                className='flex flex-col gap-3 rounded-xl border border-border p-4'
              >
                <div
                  className='h-24 w-full rounded-xl'
                  style={{ background: color.background }}
                />
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{color.name}</span>
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
