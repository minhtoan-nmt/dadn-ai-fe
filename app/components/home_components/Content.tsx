import { FaCircle, FaTemperatureHalf } from "react-icons/fa6";
import { IoWaterOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { PiFan } from "react-icons/pi";
import { BiSolidToggleRight } from "react-icons/bi";
import { useEffect, useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import ToggleButton from "./ToggleButton";

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
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [lightIntensity, setLightIntensity] = useState(0);
    const [isPresent, setIsPresent] = useState(false);



    let indicatorList = [
        {heading: "Temperature", icon: <FaTemperatureHalf className="size-16"/>, number: temperature, measurement: "°C", state: "Normal", stateColor: "bg-blue-400"},
        {heading: "Humidity", icon: <IoWaterOutline className="size-16"/>, number: humidity, measurement: "%", state: "Humid", stateColor: "bg-blue-200"},
        {heading: "Light Intensity", icon: <IoSunnyOutline className="size-16"/>, number: lightIntensity, measurement: "lux", state: "Heavy bright", stateColor: "bg-yellow-300"},
        {heading: "Present", icon: <BsPeople className="size-16"/>, state: (isPresent ? "Present" : "Absent"), stateColor: "bg-green-400"},
    ];

    if (temperature < 30) {
        indicatorList[0].state = "Normal";
        indicatorList[0].stateColor = "bg-red-500";
    } else if (temperature >= 30) {
        indicatorList[0].state = "High";
        indicatorList[0].stateColor = "bg-red-700";
    }

    if (lightIntensity <= 200) {
        indicatorList[2].state = "Low";
        indicatorList[2].stateColor = "bg-green-400";
    } else if (lightIntensity > 200 && lightIntensity <= 600) {
        indicatorList[2].state = "Medium";
        indicatorList[2].stateColor = "bg-yellow-400";
    } else if (lightIntensity > 600) {
        indicatorList[2].state = "High";
        indicatorList[2].stateColor = "bg-red-500";
    }


    useEffect(() => {
        const source = new EventSource("http://localhost:3000/api/stream");

        // source.addEventListener('message', (e) => {
        //     const data = JSON.parse(e.data);
        // })

        // source.onopen = () => {
        //     elStatus.textContent = "Đã kết nối";
        //     elStatus.classList.remove("err");
        //     elStatus.classList.add("ok");
        // };

        source.addEventListener("sensor", (e) => {
            try {
              const data = JSON.parse(e.data);
              if (data.nhietDo !== undefined)
                setTemperature(data.nhietDo);

              if (data.doAm !== undefined)
                setHumidity(data.doAm);

              if (data.anhSang !== undefined)
                setLightIntensity(data.anhSang);
            } catch {
              console.warn("Không parse được JSON:", e.data);
            }
          });

        // return () => {
        //     source.close(); // cleanup on unmount
        // };
    }, [])

    return (<div>
        <h1 className="text-2xl font-bold mb-2">Indicators</h1>
        <div className="flex flex-row gap-5">
            {indicatorList.map(indicator => {
                return <Indicator key={indicator.heading} header={indicator.heading}
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

type selectorProp = {level: number, setLevel: any, deviceType: string};

function FanModeSelector({level, setLevel, deviceType}: selectorProp) {
    const options = [" Level 1", "Level 2", "Level 3"];
    // const [selected, setSelected] = useState(options[level]);
    let selected = options[level];
    console.log("Level " + level);
  

  return (
    <div className="flex justify-center items-center mt-3">
      {options.map((option, index) => (
        <div key={option} className="flex flex-row items-center">
            <div
            key={option}
            className="flex flex-col items-center cursor-pointer"
            onClick={async () => {
                setLevel(index);

                try {
                    const res = await fetch(`http://localhost:3000/api/device/setLevel/${deviceType}`, {
                        method: 'POST',
                        credentials: "include",
                        headers: {
                        'Content-Type': 'application/json',
                        },
                            body: JSON.stringify({
                            level: index, // no need for extra quotes
                        }),
                    });

                    if (!res.ok) {
                        console.error(`Request failed with status: ${res.status}`);
                    } else {
                        const data = await res.json();
                        console.log('Response:', data);
                    }
                    } catch (error) {
                    console.error('Fetch error:', error);
                    }

                
            }}
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
    const [powerMode, setPowerMode] = useState("Off");
    const [auto, setAuto] = useState("Manual");
    const [level, setLevel] = useState(0);

    const [isPowerOn, setIsPowerOn] = useState(powerMode === "On");
    const [isAuto, setIsAuto] = useState(false);

    let name;
    if (deviceName === "Fan") {
        name = "fan";
    } else if (deviceName === "Light") {
        name = "light";
    } else {
        name = "microphone";
    }

    useEffect(() => {
        const deviceInfo = async () => {
            try {
                const res = await fetch(`/api/device/getInfoDevice/${name}`);
                if (!res.ok)
                    throw new Error(`${res.status}`);
                const data = await res.json();
                if (data.isActive) {
                    setPowerMode("On");
                    setIsPowerOn(true);
                } else {
                    setPowerMode("Off");
                    setIsPowerOn(false);
                }
                if (data.auto) {
                    setAuto("Auto");
                    setIsAuto(true);
                } else {
                    setAuto("Manual");
                    setIsAuto(false);
                }

                if (data.name == 'light') {
                    setLevel(data.brightness);
                } else if (data.name == 'fan') {
                    setLevel(data.speed);
                }
            } catch (error) {
                console.error(error);
            }
        }
        deviceInfo();
    }, [])    

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
                        <p className="font-semibold text-xl">{powerMode}</p>
                        {/* <BiSolidToggleRight className="size-15 fill-indigo-600"/> */}
                        <button onClick={async () => {
                            // powerMode === "On" ? setPowerMode("Off") : setPowerMode("On");
                            if (powerMode === "On") {
                                setPowerMode("Off");
                                setIsPowerOn(false);
                            } else {
                                setPowerMode("On");
                                setIsPowerOn(true);
                            }
                            try {
                              const data = await fetch(`http://localhost:3000/api/device/statusToggle/${name}`, {
                                method: 'POST',
                                credentials: "include"
                              });
                              console.log(data);
                            } catch (error) {
                              console.error('Error: ', error);
                            }
                        }}>
                            <ToggleButton isOn={isPowerOn}  name={name} buttonType="statusToggle"/>
                        </button>
                    </div>
                    <div className="flex flex-row items-center justify-end gap-5">
                        <p className="font-semibold text-xl">{toggleName2}</p>
                        <button onClick={async () => {
                            // auto === "Auto" ? setAuto("Manual") : setAuto("Auto");
                            if (auto === "Auto") {
                                setAuto("Manual");
                                setIsAuto(false);
                            } else {
                                setAuto("Auto");
                                setIsAuto(true);
                            }
                            try {
                              const data = await fetch(`http://localhost:3000/api/device/autoToggle/${name}`, {
                                method: 'POST',
                              });
                              console.log(data);
                            } catch (error) {
                              console.error('Error: ', error);
                            }
                        }}>
                            <ToggleButton isOn={isAuto} name={name} buttonType="autoToggle"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-evenly h-fit w-full">
                    {/* Selector */}
                <FanModeSelector level={level} setLevel={setLevel} deviceType={name}/>
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
        <h1 className="font-bold text-2xl">Devices</h1>
        <div className="flex flex-row gap-10">
            {deviceList.map(item => {
                return <DeviceInfo key={item.deviceName} deviceName={item.deviceName}
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