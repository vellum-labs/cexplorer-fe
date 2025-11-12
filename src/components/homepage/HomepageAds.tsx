import type { FC } from "react";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@vellumlabs/cexplorer-sdk";
import type dynamicIconImports from "lucide-react/dynamicIconImports";

interface HomepageAdsProps {
  miscBasicAds: {
    data: {
      content: string;
      icon: keyof typeof dynamicIconImports;
      section: string;
      title: string;
      type: string;
      link: string;
      text: string;
      img: string | null;
    };
    type: string;
  }[];
}

export const HomepageAds: FC<HomepageAdsProps> = ({ miscBasicAds }) => {
  return (
    <div className='flex h-full w-full items-center overflow-hidden rounded-m'>
      <Carousel
        plugins={[Autoplay({ delay: 4000 })]}
        className='flex !h-full !w-full items-center'
        opts={{ loop: true }}
      >
        <CarouselContent
          wrapperClassName='w-full h-full !-mx-0 !-my-0 !p-0'
          className='-ml-0 flex h-full w-full items-stretch overflow-visible'
        >
          {miscBasicAds.map(({ data: { img, title, text, link } }) => (
            <CarouselItem
              className='flex h-full w-full !basis-full cursor-pointer items-center justify-center bg-cardBg !pl-0'
              onClick={() => {
                window.open(link, "_blank");
              }}
            >
              {img ? (
                <img src={img} alt={title} className='h-full w-full' />
              ) : (
                <div className='flex flex-col items-center p-1'>
                  <h3>{title}</h3>
                  <span>{text}</span>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
