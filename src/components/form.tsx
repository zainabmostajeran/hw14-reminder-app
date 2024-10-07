import React from "react";
import { Input } from "./Input";
import ModalEdit from "./modals";
import AlarmModal from "./alarmModal";
import useSound from 'use-sound';


interface IValuesType<T = string> {
  AlarmTitle: T;
  AlarmDescription: T;
  AlarmTime: T;
}
type validatorFunc = (_: string) => string | null;
const validator: IValuesType<validatorFunc> = {
  AlarmTitle: (value: string) => {
    if (!value) return "Invalid text";
    return value?.length > 5 ? null : "AlarmTitle length must be 5 character";
  },
  AlarmDescription: (value: string) => {
    if (!value) return "Invalid text";
    return value?.length > 16 ? null : "AlarmDescription must be 16 character";
  },
  AlarmTime: (value: string) => {
    // if (isNaN(Number(value))) return "Invalid number";
    return value.length <= 8 ? null : "AlarmTime must be 8 character";
  },
};
export const Form: React.FC = () => {
  const [values, setValues] = React.useState<IValuesType>({
    AlarmTitle: "",
    AlarmDescription: "",
    AlarmTime: "",
  });
  const [errors, setErrors] = React.useState<IValuesType>({
    AlarmTitle: "",
    AlarmDescription: "",
    AlarmTime: "",
  });
  const [firstTimeLoading, setFirstTimeLoading] = React.useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [disable, setDisable] = React.useState<boolean>(true);
  const [list, setList] = React.useState<IValuesType[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [activeAlarm, setActiveAlarm] = React.useState<IValuesType | null>(
    null
  );
  const [showAlarmModal, setShowAlarmModal] = React.useState<boolean>(false);
  const[isPlaying,setIsPlaying]=React.useState<boolean>(false);

  const onChangeHandler = (fieldName: keyof IValuesType, value: string) => {
    const newValues = { ...values };
    newValues[fieldName] = value;
    setValues(newValues);
  };

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (Object.values(errors).some((error) => error.length > 0)) return;

    if (editingIndex !== null) {
      const updatedList = [...list];
      updatedList[editingIndex] = { ...values };
      setList(updatedList);
      setEditingIndex(null);
    } else {
      setList([...list, { ...values }]);
    }
    setValues({ AlarmTitle: "", AlarmDescription: "", AlarmTime: "" });
    setErrors({ AlarmTitle: "", AlarmDescription: "", AlarmTime: "" });
    setIsSubmitting(true);
  };
  //remove
  const removeItem = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };
  //edit
  function EditValue(index: number) {
    setEditingIndex(index);
    setShowModal(true);
  }
  // sort
  function sortAlarmTime() {
    setList((prevList) =>
      [...prevList].sort((a, b) => a.AlarmTime.localeCompare(b.AlarmTime))
    );
  }
  function sortAlarmTitle() {
    setList((prevList) =>
      [...prevList].sort((a, b) => a.AlarmTitle.localeCompare(b.AlarmTitle))
    );
  }

  const handleModalConfirm = () => {
    if (editingIndex !== null) {
      const selectedItem = list[editingIndex];
      setValues({
        AlarmTitle: selectedItem.AlarmTitle,
        AlarmDescription: selectedItem.AlarmDescription,
        AlarmTime: selectedItem.AlarmTime,
      });
    }
    setShowModal(false);
  };
  function onclosebtn() {
    setShowModal(false);
  }
  // function playSound(){
  //   const [playSound] = useSound('sound.mp3');
  //   re

  // }

  // Handle snooze (close modal)
  const onSnooze = () => {
    setShowAlarmModal(false);
    setActiveAlarm(null);
  };

  // Handle delete (remove alarm and close modal)
  const onDelete = () => {
    setShowAlarmModal(false);
    if (activeAlarm) {
      const updatedList = list.filter(
        (alarm) => alarm.AlarmTime !== activeAlarm.AlarmTime
      );
      setList(updatedList);
      setActiveAlarm(null);
    }
  };

  // Ensure time format consistency
  const formatTime = (time: string) => {
    return time.slice(0, 5); // Extract "HH:mm" format from time input
  };

  // Logic to check if alarm time has arrived
  React.useEffect(() => {
    const checkAlarms = () => {
      const currentTime = new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      console.log("Current Time:", currentTime);
      console.log(
        "Alarm Times:",
        list.map((alarm) => formatTime(alarm.AlarmTime))
      );

      const activeAlarm = list.find(
        (alarm) => formatTime(alarm.AlarmTime) === currentTime
      );

      if (activeAlarm) {
        setActiveAlarm(activeAlarm);
        setIsPlaying(true);
        setShowAlarmModal(true);
      }
    };

    const intervalId = setInterval(checkAlarms, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [list]);
  React.useEffect(() => {
    if (firstTimeLoading) {
      setFirstTimeLoading(false);
      return;
    }
    const newErrors = { ...errors };
    const AlarmTitleError = validator.AlarmTitle(values.AlarmTitle);
    if (AlarmTitleError) newErrors.AlarmTitle = AlarmTitleError;
    else newErrors.AlarmTitle = "";
    const AlarmDescriptionError = validator.AlarmDescription(
      values.AlarmDescription
    );
    if (AlarmDescriptionError)
      newErrors.AlarmDescription = AlarmDescriptionError;
    else newErrors.AlarmDescription = "";
    const AlarmTimeError = validator.AlarmTime(values.AlarmTime);
    if (AlarmTimeError) newErrors.AlarmTime = AlarmTimeError;
    else newErrors.AlarmTime = "";

    if (AlarmTitleError || AlarmDescriptionError || AlarmTimeError)
      setDisable(true);
    setDisable(
      !!AlarmTitleError || !!AlarmDescriptionError || !!AlarmTimeError
    );

    setErrors(newErrors);
  }, [values]);
  return (
    <main className="bg-slate-100 min-h-screen">
      <section className="space-y-5 container mx-auto max-w-[500px] py-10 px-4">
        <form
          onSubmit={onSubmitHandler}
          className="bg-white rounded-md shadow-md px-6 py-4"
        >
          <p className="text-gray-800 font-semibold text-3xl mb-8">
            reminder program
          </p>
          <div className="space-y-4">
            <Input
              type="time"
              placeholder="AlarmTime"
              error={errors.AlarmTime}
              value={values.AlarmTime}
              onChange={(event) =>
                onChangeHandler("AlarmTime", event.target.value)
              }
            />
            <Input
              type="text"
              placeholder="AlarmTitle"
              error={errors.AlarmTitle}
              value={values.AlarmTitle}
              onChange={(event) =>
                onChangeHandler("AlarmTitle", event.target.value)
              }
            />
            <Input
              type="text"
              placeholder="AlarmDescription"
              error={errors.AlarmDescription}
              value={values.AlarmDescription}
              onChange={(event) =>
                onChangeHandler("AlarmDescription", event.target.value)
              }
            />

            <button
              disabled={disable}
              type="submit"
              className="bg-green-700 hover:!bg-slate-950 text-white font-semibold rounded-md px-2 py-1 w-full disabled:bg-gray-600 "
            >
              Submit
            </button>
          </div>
        </form>
      </section>
      {isSubmitting && (
        <section className="space-y-5 container mx-auto min-w-[300px] py-10 px-4">
          <table className=" w-5/12 mx-auto shadow-md border border-separate rounded-md">
            <thead>
              <tr>
                <th className="text-sm sm:text-base pr-4 text-nowrap py-3 px-2">
                  AlarmTime
                  <img
                    onClick={() => sortAlarmTime()}
                    className="w-5 inline-block cursor-pointer"
                    src="Double_angle_down_font_awesome.svg"
                    alt=""
                  />
                </th>
                <th className="text-sm sm:text-base text-nowrap">
                  AlarmTitle
                  <img
                    onClick={() => sortAlarmTitle()}
                    className="w-5 inline-block cursor-pointer"
                    src="Double_angle_down_font_awesome.svg"
                    alt=""
                  />
                </th>
                <th className="text-sm sm:text-base">state</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {list.map((el, index) => (
                <tr key={index}>
                  <td>{el.AlarmTime}</td>
                  <td className="max-w-3 overflow-clip text-wrap">
                    {el.AlarmTitle}
                  </td>
                  <td className="flex gap-2 p-3 items-center justify-center">
                    <button
                      onClick={() => EditValue(index)}
                      className="bg-gray-700 p-2 rounded-lg text-white hover:bg-white hover:text-gray-700 hover:border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="bg-red-600 p-2 rounded-lg text-white hover:bg-white hover:text-red-600 hover:border"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {showModal && (
        <ModalEdit
          open={showModal}
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
          onclose={onclosebtn}
        />
      )}
      {activeAlarm && showAlarmModal && (
        <AlarmModal
          open={showAlarmModal}
          onSnooze={onSnooze}
          onDelete={onDelete}
          AlarmTime={activeAlarm.AlarmTime}
        />
      )}
    </main>
  );
};
