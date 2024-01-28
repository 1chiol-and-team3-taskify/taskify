import DashboardBtn from "@/components/button/DashboardBtn/DashboardBtn";

const mockData = [
  {
    id: 0,
    title: "비브리지",
    color: "orange",
    createdByMe: true,
  },
  {
    id: 1,
    title: "테스트입니다",
    color: "green",
    createdByMe: false,
  },
  {
    id: 2,
    title: "혼공컴운",
    color: "blue",
    createdByMe: true,
  },
  {
    id: 3,
    title: "대시보드테스트",
    color: "red",
    createdByMe: false,
  },
];

function MyPage() {
  return (
    <>
      <DashboardBtn data={mockData} />
    </>
  );
}

export default MyPage;
