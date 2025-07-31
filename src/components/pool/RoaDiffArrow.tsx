import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  color: "green" | "red" | "orange";
  size?: number;
}

const RoaDiffArrow = ({ color, size = 20 }: Props) => {
  switch (color) {
    case "green":
      return <ChevronUp size={size} className='stroke-[#17B26A]' />;
    case "orange":
      return <ChevronUp size={size} className='stroke-[#FEC84B]' />;
    case "red":
      return <ChevronDown size={size} className='stroke-[#F04438]' />;
  }
};

export default RoaDiffArrow;
