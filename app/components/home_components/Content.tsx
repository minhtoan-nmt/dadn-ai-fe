import { FaCircle, FaTemperatureHalf } from "react-icons/fa6";
import { IoWaterOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { PiFan } from "react-icons/pi";
import { useEffect, useState, useRef } from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import ToggleButton from "./ToggleButton";
import MicrophoneInfo from "./MicrophoneInfo";

export type ContentProp = {className: string};
type IndicatorProp = {header: string, icon: any, number: number | undefined, measurement: string | undefined, state: string, stateColor: string};

function Indicator({header, icon, number=undefined, measurement=undefined, state, stateColor}: IndicatorProp) {
    return (
        <div className="w-52 h-40 bg-white rounded-2xl flex flex-col justify-between p-3">
            <p className="font-semibold text-center">{header}</p>
        <div className="flex flex-row items-center justify-center gap-2 ">
            {icon} 
            {(number !== undefined) && <p className="font-medium text-3xl whitespace-nowrap">{number} {measurement}</p>}
        </div>
        <div className={stateColor + " w-3/4 text-center mx-auto rounded-2xl font-bold p-1"}>
            {state}
        </div>
    </div>
    )
}

function IndicatorSection() {
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [lightIntensity, setLightIntensity] = useState(0);

    let indicatorList = [
        {heading: "Temperature", icon: <FaTemperatureHalf className="size-16"/>, number: temperature, measurement: "°C", state: "Normal", stateColor: "bg-blue-400"},
        {heading: "Humidity", icon: <IoWaterOutline className="size-16"/>, number: humidity, measurement: "%", state: "Humid", stateColor: "bg-blue-200"},
        {heading: "Light Intensity", icon: <IoSunnyOutline className="size-16"/>, number: lightIntensity, measurement: "lux", state: "Heavy bright", stateColor: "bg-yellow-300"},
    ];

    // Logic màu sắc chỉ báo (giữ nguyên logic của bạn)
    if (temperature < 20) { 
        indicatorList[0].state = "Low"; indicatorList[0].stateColor = "bg-sky-300"; 
    } else if (temperature >= 20 && temperature < 30) { 
        indicatorList[0].state = "Normal"; indicatorList[0].stateColor = "bg-yellow-400"; 
    } else if (temperature >= 30) { 
        indicatorList[0].state = "High"; indicatorList[0].stateColor = "bg-red-500"; 
    }

    if (lightIntensity <= 200) {
        indicatorList[2].state = "Low"; indicatorList[2].stateColor = "bg-green-400";
    } else if (lightIntensity > 200 && lightIntensity <= 600) {
        indicatorList[2].state = "Medium"; indicatorList[2].stateColor = "bg-yellow-400";
    } else if (lightIntensity > 600) {
        indicatorList[2].state = "High"; indicatorList[2].stateColor = "bg-red-500";
    }

    useEffect(() => {
        const source = new EventSource("http://localhost:3000/api/stream/sensor", {
            withCredentials: true,
        });

        source.addEventListener("sensor", (e) => {
            try {
              const data = JSON.parse(e.data);
              if (data.TEMP !== undefined) setTemperature(data.TEMP);
              if (data.HUMI !== undefined) setHumidity(data.HUMI);
              if (data.LIGHT !== undefined) setLightIntensity(data.LIGHT);
            } catch {
              console.warn("Không parse được JSON:", e.data);
            }
          });

        return () => {
            source.close();
        };
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

type selectorProp = {level: number, setLevel: any, deviceType: string, deviceStatus: string};

function DeviceLevelSelector({level, setLevel, deviceType, deviceStatus}: selectorProp) {
    const fanOptions = ["Breeze", "Normal", "Turbo"];
    const lightOptions = ["Dim", "Normal", "Bright"];
    const options = deviceType === 'fan' ? fanOptions : lightOptions;
    let selected = options[level - 1];

  return (
    <div className="flex justify-center items-center mt-3">
      {options.map((option, index) => (
        <div key={option} className="flex flex-row items-center">
            <div
            key={option}
            className="flex flex-col items-center cursor-pointer"
            onClick={async () => {
                if (deviceStatus === "Off") {
                    alert(`The ${deviceType} is not on!`);
                    return;
                }
                setLevel(index + 1);
                try {
                    await fetch(`http://localhost:3000/api/device/setLevel/${deviceType}`, {
                        method: 'POST',
                        credentials: "include",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ level: index + 1 }),
                    });
                } catch (error) { console.error('Fetch error:', error); }
            }}
            >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === option ? "border-blue-500" : "border-blue-300"}`}>
                {selected === option && (<FaCircle className="text-blue-500 text-[10px]" />)}
            </div>
            <span className="mt-2 text-black">{option}</span>
            </div>
            {index < 2 && <div className="h-[2px] w-10 bg-blue-300 mb-7"></div>}
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
    const [isTogglingAuto, setIsTogglingAuto] = useState(false); // Giữ lại biến này nếu bạn dùng loading
    
    // Threshold States
    const [tempThreshold, setTempThreshold] = useState("35");
    const [humidityThreshold, setHumidityThreshold] = useState("60");
    const [lightThreshold, setLightThreshold] = useState("300");
    const [inputTemp, setInputTemp] = useState("35");
    const [inputHumidity, setInputHumidity] = useState("60");
    const [inputLight, setInputLight] = useState("300");

    const statusEventSourceRef = useRef<EventSource | null>(null);
    const tempInputRef = useRef<HTMLInputElement>(null);
    const humidityInputRef = useRef<HTMLInputElement>(null);
    const lightInputRef = useRef<HTMLInputElement>(null);

    let name: string;
    if (deviceName === "Fan") name = "fan";
    else if (deviceName === "Light") name = "light";
    else name = "microphone";

    // --- 1. TÁCH HÀM LẤY DỮ LIỆU RIÊNG ĐỂ DÙNG LẠI ---
    const fetchDeviceInfo = async () => {
        try {
            console.log(`[${name}] Fetching device info...`);
            const res = await fetch(`http://localhost:3000/api/device/getInfoDevice/${name}`, {
                method: 'GET',
                credentials: "include"
            });
            if (!res.ok) throw new Error(`${res.status}`);
            const data = await res.json();

            // Cập nhật State
            setPowerMode(data.isActive ? "On" : "Off");
            setIsPowerOn(data.isActive);
            setAuto(data.auto ? "Auto" : "Manual");
            setIsAuto(data.auto);

            if (data.name == 'light') {
                setLevel(data.brightness);
                setLightThreshold(data.lightThreshold || "90");
                setInputLight(data.lightThreshold || "90");
            } else if (data.name == 'fan') {
                setLevel(data.speed);
                setTempThreshold(data.tempThreshold || "25");
                setInputTemp(data.tempThreshold || "25");
                setHumidityThreshold(data.humidityThreshold || "90");
                setInputHumidity(data.humidityThreshold || "90");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // --- 2. GỌI LẦN ĐẦU KHI MOUNT ---
    useEffect(() => {
        fetchDeviceInfo();
    }, [name]);

    // --- 3. LẮNG NGHE SỰ KIỆN TỪ MICROPHONE (CUSTOM EVENT) ---
    useEffect(() => {
        const handleAIUpdate = (event: any) => {
            const label = event.detail.label; // Ví dụ: "LIGHT_ON", "FAN_OFF"
            console.log(`[${name}] Event received:`, label);

            let shouldUpdate = false;
            // Kiểm tra xem label có liên quan đến thiết bị này không
            if (name === 'light' && label.includes('LIGHT')) shouldUpdate = true;
            else if (name === 'fan' && label.includes('FAN')) shouldUpdate = true;
            else if (label.includes('RESET')) shouldUpdate = true; // Reset thì update cả 2

            if (shouldUpdate) {
                console.log(`[${name}] Label matched! Refreshing UI...`);
                fetchDeviceInfo(); // <--- GỌI LẠI HÀM FETCH
            }
        };

        window.addEventListener("ai-command-completed", handleAIUpdate);
        return () => {
            window.removeEventListener("ai-command-completed", handleAIUpdate);
        };
    }, [name]);


    // --- 4. STREAM LISTENER CHO AUTO MODE (GIỮ NGUYÊN) ---
    useEffect(() => {
        if (isAuto && (name === 'fan' || name === 'light')) {
            if (statusEventSourceRef.current) statusEventSourceRef.current.close();
            const source = new EventSource("http://localhost:3000/api/stream/status", { withCredentials: true });
            statusEventSourceRef.current = source;

            source.addEventListener("status", (e) => {
                 try {
                     const data = JSON.parse(e.data);
                     let newIsActive: boolean | undefined = undefined;

                     if (name === 'fan' && typeof data.fan === 'boolean') newIsActive = data.fan;
                     else if (name === 'light' && typeof data.light === 'boolean') newIsActive = data.light;

                     if (typeof newIsActive === 'boolean') {
                         setIsPowerOn(current => {
                             if (current !== newIsActive) {
                                 setPowerMode(newIsActive ? "On" : "Off");
                                 return newIsActive;
                             }
                             return current;
                         });
                     }
                 } catch (err) { console.warn(err); }
            });

            // Fallback
            source.addEventListener("message", (e) => {}); 
        }
        return () => {
            if (statusEventSourceRef.current) {
                statusEventSourceRef.current.close();
                statusEventSourceRef.current = null;
            }
        };
    }, [isAuto, name]);

    // --- CÁC HÀM XỬ LÝ NÚT BẤM (GIỮ NGUYÊN) ---
    const handleSaveThresholds = async () => {
        const body = (name === 'fan')
            ? { tempThreshold: Number(inputTemp), humidityThreshold: Number(inputHumidity) }
            : { lightThreshold: Number(inputLight) };
        try {
            const res = await fetch(`http://localhost:3000/api/device/setThreshold/${name}`, {
                method: 'POST', credentials: "include",
                headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed");
            if (name === 'fan') { setTempThreshold(inputTemp); setHumidityThreshold(inputHumidity); }
            else { setLightThreshold(inputLight); }
            alert('Thresholds saved successfully!');
        } catch (error: any) { alert(`Save failed: ${error.message}`); }
    };

    const handleResetThresholds = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/device/resetThreshold/${name}`, {
                method: 'POST', credentials: "include",
            });
            if (!res.ok) throw new Error("Failed");
            const def = await res.json();
            alert("Thresholds reset successfully!");
            if (name === 'fan') {
                setTempThreshold(def.temp || "35"); setHumidityThreshold(def.humidity || "60");
                setInputTemp(def.temp || "35"); setInputHumidity(def.humidity || "60");
            } else if (name === 'light') {
                setLightThreshold(def.light || "300"); setInputLight(def.light || "300");
            }
        } catch (error: any) { alert(`Reset failed: ${error.message}`); }
    };

    return (
        <div className="w-xs h-fit bg-white rounded-xl p-3 ">
            <h1 className="text-center font-semibold text-2xl">{deviceName}</h1>
            <div className="grid grid-cols-2">
                <div className="flex flex-col items-center">
                    {deviceIcon}
                    <p className="font-semibold text-xl whitespace-nowrap">Status: {powerMode === 'On' ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="flex flex-col gap-5">
                    {/* TOGGLE POWER */}
                    <div className="flex flex-row items-center justify-end gap-5">
                        <p className="font-semibold text-xl">{toggleName1}</p>
                        <button onClick={async () => {
                            const nextState = powerMode === "On" ? "Off" : "On";
                            setPowerMode(nextState);
                            setIsPowerOn(nextState === "On");
                            try {
                              await fetch(`http://localhost:3000/api/device/statusToggle/${name}`, {
                                method: 'POST', credentials: "include"
                              });
                            } catch (error) { console.error(error); }
                        }}>
                            <ToggleButton isOn={isPowerOn}  name={name} buttonType="statusToggle"/>
                        </button>
                    </div>
                    {/* TOGGLE AUTO */}
                    <div className="flex flex-row items-center justify-end gap-5">
                        <p className="font-semibold text-xl">{toggleName2}</p>
                        <button onClick={async () => {
                            setIsTogglingAuto(true);
                            const nextIsAuto = !isAuto;
                            setIsAuto(nextIsAuto);
                            setAuto(nextIsAuto ? "Auto" : "Manual");
                            try {
                              const res = await fetch(`http://localhost:3000/api/device/autoToggle/${name}`, {
                                method: 'POST', credentials: "include",
                                body: JSON.stringify({auto: nextIsAuto})
                              });
                              if (!res.ok) { // Revert nếu lỗi
                                setIsAuto(!nextIsAuto); setAuto(nextIsAuto ? "Manual" : "Auto");
                              }
                            } catch (error) { console.error(error); }
                        }}>
                            <ToggleButton isOn={isAuto} name={name} buttonType="autoToggle"/>
                        </button>
                    </div>
                </div>
            </div>
            <hr className="border-gray-200"/>
            <div className="flex items-center justify-evenly h-fit w-full">
                <p className="font-semibold text-gray-600 text-sm mb-1">{name === 'fan' ? 'Speed' : 'Brightness'}</p>
                <DeviceLevelSelector level={level} setLevel={setLevel} deviceType={name} deviceStatus={powerMode}/>
            </div>

            {/* THRESHOLD SECTION */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-600 text-sm">Activation Threshold</p>
                    <div className="flex items-center gap-2">
                        <button onClick={handleResetThresholds} className="text-sm bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-300">Reset</button>
                        <button onClick={handleSaveThresholds} className="bg-indigo-600 text-white py-1.5 px-5 rounded-lg hover:bg-indigo-700 font-semibold text-sm">Save</button>
                    </div>
                </div>
                <div className="mt-1">
                    {name === 'fan' && (
                        <div className="flex flex-row gap-2">
                            <div onClick={() => tempInputRef.current?.focus()} className="bg-gray-100 rounded-lg p-2 flex items-center justify-between flex-1 cursor-text">
                                <input ref={tempInputRef} type="number" value={inputTemp} onChange={(e) => setInputTemp(e.target.value)}
                                    className="text-xl font-bold w-full text-left outline-none bg-transparent appearance-none" />
                                <span className="text-lg font-bold text-gray-500 ml-1">°C</span>
                            </div>
                            <div onClick={() => humidityInputRef.current?.focus()} className="bg-gray-100 rounded-lg p-2 flex items-center justify-between flex-1 cursor-text">
                                <input ref={humidityInputRef} type="number" value={inputHumidity} onChange={(e) => setInputHumidity(e.target.value)}
                                    className="text-xl font-bold w-full text-left outline-none bg-transparent appearance-none" />
                                <span className="text-lg font-bold text-gray-500 ml-1">%</span>
                            </div>
                        </div>
                    )}
                    {name === 'light' && (
                        <div onClick={() => lightInputRef.current?.focus()} className="bg-gray-100 rounded-lg p-2 flex items-center justify-between cursor-text">
                            <input ref={lightInputRef} type="number" value={inputLight} onChange={(e) => setInputLight(e.target.value)}
                                className="text-xl font-bold w-full text-left outline-none bg-transparent appearance-none" />
                            <span className="text-lg font-bold text-gray-500 ml-1">lux</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function DeviceInfoSection() {
    let deviceList = [
        { deviceName: "Fan", deviceStatus: "Active", toggleName1: "Power", toggleName2: "Auto", deviceIcon: <PiFan className="size-35"/> },
        { deviceName: "Light", deviceStatus: "Active", toggleName1: "Power", toggleName2: "Auto", deviceIcon: <HiOutlineLightBulb className="size-35"/> },
    ];
    return (<div>
        <h1 className="font-bold text-2xl">Devices</h1>
        <div className="flex flex-row gap-10 wrap">
            {deviceList.map(item => <DeviceInfo key={item.deviceName} {...item} />)}
            <MicrophoneInfo />
        </div>
    </div>)
}

export default function Content({className = ""}: ContentProp) {
    return (<div className={className}><IndicatorSection /><DeviceInfoSection /></div>)
}