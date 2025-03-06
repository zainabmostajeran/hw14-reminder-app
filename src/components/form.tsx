import React from "react";
import { Input } from "./Input";
import ModalEdit from "./modals";
import AlarmModal from "./alarmModal";
import DeleteModal from "./DeleteModal";

interface IValuesType<T = string> {
  AlarmTitle: T;
  AlarmDescription: T;
  AlarmTime: T;
}
type validatorFunc = (_: string) => string | null;
const validator: IValuesType<validatorFunc> = {
  AlarmTitle: (value: string) => {
    if (!value) return null;
    return value?.length > 5 ? null : "AlarmTitle length must be 5 character";
  },
  AlarmDescription: (value: string) => {
    if (!value) return null;
    return value?.length > 10 ? null : "AlarmDescription must be 10 character";
  },
  AlarmTime: (value: string) => {
    if (!value) return null;
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
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [activeAlarm, setActiveAlarm] = React.useState<IValuesType | null>(
    null
  );
  const [showAlarmModal, setShowAlarmModal] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const onChangeHandler = (fieldName: keyof IValuesType, value: string) => {
    const newValues = { ...values };
    newValues[fieldName] = value;
    setValues(newValues);
  };

  const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
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
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const removeItem = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const ConfirmDelete = () => {
    if (deleteIndex !== null) {
      setList(list.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setShowDeleteModal(false);
    }
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
  // handleModalConfirm
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
  //  snooze
  const onSnooze = () => {
    setShowAlarmModal(false);
    const intervalId = setInterval(() => {
      setShowAlarmModal(true);
    }, 100000);
    return clearInterval(intervalId);
  };
  //  delete
  const onDelete = () => {
    setShowAlarmModal(false);
    if (activeAlarm) {
      const updatedList = list.filter(
        (alarm) => alarm.AlarmTime !== activeAlarm.AlarmTime
      );
      setList(updatedList);
    }
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };
  //  check if alarm time has arrived
  React.useEffect(() => {
    const checkAlarms = () => {
      const currentTime = new Date().toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log(currentTime);

      const ActiveAlarm = list.find(
        (el) => formatTime(el.AlarmTime) === currentTime
      );

      if (ActiveAlarm) {
        setActiveAlarm(ActiveAlarm);
        setShowAlarmModal(true);
        setIsPlaying(true);
      }
    };
    const intervalId = setInterval(checkAlarms, 1000);

    return () => clearInterval(intervalId);
  }, [list]);

  // error handler
  React.useEffect(() => {
    if (firstTimeLoading) {
      setFirstTimeLoading(false);
      return;
    }

    const newErrors = { ...errors };

    const AlarmTitleError = values.AlarmTitle
      ? validator.AlarmTitle(values.AlarmTitle)
      : "";
    const AlarmDescriptionError = values.AlarmDescription
      ? validator.AlarmDescription(values.AlarmDescription)
      : "";
    const AlarmTimeError = values.AlarmTime
      ? validator.AlarmTime(values.AlarmTime)
      : "";

    newErrors.AlarmTitle = AlarmTitleError || "";
    newErrors.AlarmDescription = AlarmDescriptionError || "";
    newErrors.AlarmTime = AlarmTimeError || "";

    const isEmpty =
      !values.AlarmTitle || !values.AlarmDescription || !values.AlarmTime;

    setDisable(
      !!AlarmTitleError ||
        !!AlarmDescriptionError ||
        !!AlarmTimeError ||
        isEmpty
    );

    setErrors(newErrors);
  }, [values]);

  return (
    <main className=" min-h-screen">
      <section className="space-y-5 container mx-auto max-w-[800px] py-10 px-4 ">
        <form
          onSubmit={onSubmitHandler}
          className="rounded-md shadow-md px-6 py-5 bg-[#6da7fa]"
        >
          <div className="space-y-2">
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
            <Input
              type="time"
              placeholder="AlarmTime"
              error={errors.AlarmTime}
              value={values.AlarmTime}
              onChange={(event) =>
                onChangeHandler("AlarmTime", event.target.value)
              }
            />
            <div className="text-center">
              <button
                disabled={disable}
                type="submit"
                className="bg-[#61687e]  rounded-md px-10 py-2 mx-auto font-bold border-2 text-white shadow-blue-300/60 shadow-lg hover:bg-blueApp_2/50 hover:text-black disabled:hover:text-white disabled:hover:cursor-default disabled:bg-grayApp "
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
      {isSubmitting && (
        <section className=" bg-[#6da7fa] rounded-md border-2 border-white max-w-[780px] mx-auto">
          <div className="grid grid-cols-[2fr_1fr_1fr] text-center font-bold text-gray-800 text-lg border-b-2  rounded-t-md">
            <div
              className="flex items-center justify-center gap-2  border-r-2 cursor-pointer hover:bg-blue-500 py-5"
              onClick={sortAlarmTitle}
            >
              Title of Alarms
              <img
                className="w-4"
                src="Double_angle_down_font_awesome.svg"
                alt=""
              />
            </div>
            <div
              className="flex items-center justify-center gap-2  border-r-2 cursor-pointer hover:bg-blue-500 py-5"
              onClick={sortAlarmTime}
            >
              Alarm At
              <img
                className="w-4"
                src="Double_angle_down_font_awesome.svg"
                alt=""
              />
            </div>
            <div className="py-5">Operation</div>
          </div>

          {list.length > 0 ? (
            list.map((el, index) => (
              <div className="bg-[#6da7fa] rounded-md">
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center m-5  bg-white/95  rounded-md  shadow-lg shadow-[#2a4263]"
                >
                  <div className="py-3 border-r-2 px-3 font-bold text-lg">
                    {el.AlarmTitle}
                  </div>
                  <div className="py-3 border-r-2 px-3 font-bold text-lg">
                    {el.AlarmTime}
                  </div>
                  <div className="flex gap-2 justify-center py-3">
                    <button
                      onClick={() => EditValue(index)}
                      className=" font-bold px-2 py-1 max-sm:text-sm border-2 border-white rounded-md hover:text-white shadow-blue-300/60 shadow-lg bg-[#2a4263] hover:bg-blueApp_2/50"                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeItem(index)}
                      className="font-bold px-2 py-1 max-sm:text-sm border-2 border-white rounded-md hover:text-white shadow-blue-300/60 shadow-lg bg-[#e1363b] hover:bg-redApp/50"                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-700 font-semibold">
              No alarms set.
            </div>
          )}
        </section>
      )}
      {showModal && (
        <ModalEdit
          open={showModal}
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
          onclose={() => setShowModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          open={showDeleteModal}
          onConfirm={ConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          onclose={() => setShowDeleteModal(false)}
        />
      )}
      {activeAlarm && showAlarmModal && (
        <AlarmModal
          open={showAlarmModal}
          onSnooze={onSnooze}
          onDelete={onDelete}
          AlarmTime={activeAlarm.AlarmTime}
          AlarmTitle={activeAlarm.AlarmTitle}
          sound={isPlaying}
        />
      )}
    </main>
  );
};
