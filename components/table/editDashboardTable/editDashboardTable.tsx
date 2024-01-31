import clsx from "clsx";
import styles from "./editDashboardTable.module.scss";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import mockData from "@/pages/dashboard/mock.json";
import Image from "next/image";
import { COLORS } from "@/constants/color";
import BaseButton from "@/components/button/baseButton/BaseButton";
import SelectChipDropdown from "@/components/dropdown/selectChipDropdown/SelectChipDropdown";

interface DropdownItem {
  id: number;
  title: string;
  color: string;
}

interface DashboardProps {
  data: DropdownItem[] | null;
}

const EditDashboardTable: React.FC<DashboardProps> = () => {
  const [data, setData] = useState<DropdownItem[] | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [isNotActive, setIsNotActive] = useState<boolean>(true);
  const [editName, setEditName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const dashboardId = Number(id);
  const initialColor = data?.[dashboardId]?.color || COLORS.GREEN;

  const OnNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEditName(value);
    value === "" ? setIsNotActive(true) : setIsNotActive(false);
  };

  const OnFocusInputHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setEditName("");
    setIsNotActive(true);
  };

  const fetchDashboardData = async () => {
    try {
      const result: DropdownItem[] = await mockData;
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditColorClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setIsOpen(true);
    },
    [],
  );

  const handlePopupClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedColor(initialColor);
    fetchDashboardData();
    setEditName("");
  }, [initialColor]);

  return (
    <form className={clsx(styles.tableForm)}>
      <div className={clsx(styles.currentDashboardTitle)}>
        <div className={clsx(styles.dashboardTitle)}>
          {selectedColor && (
            <div
              className={clsx(styles.chip)}
              style={{ background: selectedColor }}
              color={selectedColor}
            />
          )}
          {data?.[dashboardId]?.title}
        </div>
        <div
          className={clsx(styles.editColorOption)}
          onClick={handleEditColorClick}
        >
          <div>색상변경</div>
          <Image
            src="/icons/arrowDropdown.svg"
            width={20}
            height={20}
            alt="dropdown icon"
          />
          {isOpen && (
            <SelectChipDropdown
              onClick={handlePopupClose}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          )}
        </div>
      </div>
      <div className={clsx(styles.dashboardInputBox)}>
        <label>대시보드 이름</label>
        <input
          placeholder="뉴 프로젝트"
          value={editName}
          onChange={OnNameChangeHandler}
          onFocus={OnFocusInputHandler}
        />
      </div>
      <div className={clsx(styles.button)}>
        <BaseButton type="submit" disabled={isNotActive} small>
          변경
        </BaseButton>
      </div>
    </form>
  );
};
export default EditDashboardTable;
