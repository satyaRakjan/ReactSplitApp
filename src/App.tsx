// src/App.tsx
import React, { useEffect } from "react";
import "./App.css";
import { Flex, Splitter, Typography, Button, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { setFullPage, setClosePage, resetDefault, setSizes } from "./store/splitterSlice";

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";

const Desc: React.FC<{ text?: string | number }> = (props) => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Typography.Title type="secondary" level={5} style={{ whiteSpace: "nowrap" }}>
      {props.text}
    </Typography.Title>
  </Flex>
);
// const FirstPage: React.FC = () => <Desc text="First Panel (Route: /first)" />;
// const SecondPage: React.FC = () => <Desc text="Second Panel (Route: /second)" />




const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [enabled, setEnabled] = React.useState(true);
  const { firstSize, secondSize, showSecond } = useSelector((state: RootState) => state.splitter);
  const splitter = useSelector((state: RootState) => state.splitter);
  const [sizes, setSizesLocal] = React.useState<(number | string)[]>([
    splitter.firstSize,
    splitter.secondSize,
  ]);

    const navigate = useNavigate();

  const handleNavigate = (path: string) => navigate(path);

  useEffect(() => {
    const fetchData = async () => {
    //  await fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then((response) => response.json())
    //   .then((json) => console.log(json));

      // try {
      //   const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      //     method: "GET",
      //     headers: { "Content-Type": "application/json" }
      //   }); // your API endpoint

      //   if (!response.ok) {
      //     console.log(response)
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   } else {
      //     console.log(response)
      //   }

      // } catch (err: any) {
      //   console.log(err)
      // } finally {
      // }
    };

    fetchData();
  }, []); 





  return (
    <div className="App">
      {/* <Space style={{ margin: "10px" }}>
        <Button type="primary" onClick={() => dispatch(setFullPage())}>
          Full Page
        </Button>
        <Button onClick={() => dispatch(setClosePage())}>Close Page</Button>
        <Button onClick={() => dispatch(resetDefault())}>Reset</Button>
        <Button onClick={() => handleNavigate("/")}>Go First</Button>
        <Button onClick={() => handleNavigate("/detail")}>Go Second</Button>
      </Space> */}

      <Splitter onResizeStart={(n) => {
        console.log("fn start:", n);
      }}
        onResize={(n) => {
          const total = n.reduce((a, b) => a + b, 0);
          const percentSizes = n.map(size => (size / total) * 100);

          const first = `${percentSizes[0].toFixed(2)}%`;
          const second = `${percentSizes[1].toFixed(2)}%`;
          dispatch(setSizes({ firstSize: first, secondSize: second }));
          // console.log("Pixel sizes:", sizes);
          // console.log("Percent sizes:", percentSizes.map(p => `${p.toFixed(2)}%`));
        }}
        onResizeEnd={(n) => {
          console.log("fn end:", n);
        }}
        style={{ height: "100vh", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <Splitter.Panel size={firstSize} resizable={enabled} >
          <Routes>
            <Route path="/" element={<ListPage/>} />
            <Route path="*" element={<ListPage />} />
          </Routes>
          {/* <Desc text="First Panel" /> */}
        </Splitter.Panel>

        {showSecond && (
          <Splitter.Panel size={secondSize}  >
              <Routes>
              <Route path="/detail/:id" element={<DetailPage/>} />
              <Route path="*" element={<DetailPage />} />
            </Routes>
            {/* <Desc text="Second Panel" /> */}
          </Splitter.Panel>
        )}
      </Splitter>
    </div>
  );
};

export default App;
