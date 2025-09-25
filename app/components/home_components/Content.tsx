import { FaCircle, FaTemperatureHalf } from "react-icons/fa6";
import { IoWaterOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { PiFan } from "react-icons/pi";
import { BiSolidToggleRight } from "react-icons/bi";
import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";

type ContentProp = {className: string};
type IndicatorProp = {header: string, icon: any, number: number | undefined, measurement: string | undefined, state: string, stateColor: string};

function Indicator({header, icon, number=undefined, measurement=undefined, state, stateColor}: IndicatorProp) {
    return (<div className="w-40 h-40 bg-white rounded-2xl">
        <div className="p-3">
            <p className="font-semibold text-center">{header}</p>
        </div>
        <div className="flex flex-row items-center justify-center">
            {icon} 
            {(number !== undefined) && <p className="font-medium text-3xl">{number} {measurement}</p>}
        </div>
        <div className={stateColor + " w-30 mt-2 text-center ml-5 rounded-2xl font-bold p-1"}>
            {state}
        </div>
    </div>)
}

function IndicatorSection() {
    const indicatorList = [
        {heading: "Temperature", icon: <FaTemperatureHalf className="size-16"/>, number: 25, measurement: "°C", state: "Normal", stateColor: "bg-blue-400"},
        {heading: "Humidity", icon: <IoWaterOutline className="size-16"/>, number: 90, measurement: "%", state: "Humid", stateColor: "bg-blue-200"},
        {heading: "Light Intensity", icon: <IoSunnyOutline className="size-16"/>, number: 90, measurement: "lux", state: "Heavy bright", stateColor: "bg-yellow-300"},
        {heading: "Present", icon: <BsPeople className="size-16"/>, state: "Present", stateColor: "bg-green-400"},
    ];

    return (<div>
        <h1 className="text-2xl font-bold mb-2">Indicators</h1>
        <div className="flex flex-row gap-5">
            {indicatorList.map(indicator => {
                return <Indicator header={indicator.heading}
                    icon={indicator.icon}
                    number={indicator.number}
                    measurement={indicator.measurement}
                    state={indicator.state}
                    stateColor={indicator.stateColor}/>
            })
            }
        </div>
    </div>)
}

function FanModeSelector() {
    const [selected, setSelected] = useState("Breeze");

  const options = ["Level 0", " Level 1", "Level 2", "Level 3"];

  return (
    <div className="flex justify-center items-center mt-3">
      {options.map((option, index) => (
        <div className="flex flex-row items-center">
            <div
            key={option}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setSelected(option)}
            >
            {/* Radio circle */}
            <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selected === option ? "border-blue-500" : "border-blue-300"
                }`}
            >
                {selected === option && (
                <FaCircle className="text-blue-500 text-[10px]" />
                )}
            </div>

            {/* Label */}
            <span className="mt-2 text-black">{option}</span>
            </div>
            {index < 3 && <div className="h-[2px] w-10 bg-blue-300 mb-7"></div>}
        </div>
      ))}
      
    </div>
  );
}

type deviceInfoProps = {deviceName: string, deviceStatus: string, toggleName1: string, toggleName2: string, deviceIcon: any};

function DeviceInfo({deviceName, deviceStatus, toggleName1, toggleName2, deviceIcon}: deviceInfoProps) {
    return (
        <div className="w-sm h-fit bg-white rounded-2x p-3">
            <h1 className="text-center font-semibold text-2xl">{deviceName}</h1>
            <div className="grid grid-cols-2">
                <div className="flex flex-col items-center">
                    {deviceIcon}
                    <p className="font-semibold text-xl">Status: {deviceStatus}</p>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row items-center justify-end gap-5">
                        <p className="font-semibold text-xl">{toggleName1}</p>
                        <BiSolidToggleRight className="size-15 fill-indigo-600"/>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-5">
                        <p className="font-semibold text-xl">{toggleName2}</p>
                        <BiSolidToggleRight className="size-15 fill-indigo-600"/>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-evenly h-fit w-full">
                    {/* Selector */}
                <FanModeSelector />
            </div>
        </div>
    )
}

function DeviceInfoSection() {
    let deviceList = [
        {
            deviceName: "Fan",
            deviceStatus: "Active",
            toggleName1: "Power",
            toggleName2: "Auto",
            deviceIcon: <PiFan className="size-35"/>,
        },
        {
            deviceName: "Light",
            deviceStatus: "Active",
            toggleName1: "Power",
            toggleName2: "Auto",
            deviceIcon: <HiOutlineLightBulb className="size-35"/>,
        },
    ];

    return (<div>
        <h1>Devices</h1>
        <div className="flex flex-row gap-10">
            {deviceList.map(item => {
                return <DeviceInfo deviceName={item.deviceName}
                deviceIcon={item.deviceIcon}
                deviceStatus={item.deviceStatus}
                toggleName1={item.toggleName1}
                toggleName2={item.toggleName2}
                />   
            }      
            )}
        </div>
    </div>)
}

export default function Content({className = ""}: ContentProp) {
    return (<div className={className}>
        <IndicatorSection />
        <DeviceInfoSection />
    </div>)
}