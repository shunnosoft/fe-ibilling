import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  {
    _id: 1,
    total: 18450,
    count: 67,
  },
  {
    _id: 2,
    total: 12150,
    count: 47,
  },
  {
    _id: 3,
    total: 18150,
    count: 68,
  },
  {
    _id: 4,
    total: 13200,
    count: 48,
  },
  {
    _id: 5,
    total: 8450,
    count: 32,
  },
  {
    _id: 6,
    total: 25750,
    count: 100,
  },
  {
    _id: 7,
    total: 19900,
    count: 75,
  },
  {
    _id: 8,
    total: 20730,
    count: 77,
  },
  {
    _id: 9,
    total: 18520,
    count: 74,
  },
  {
    _id: 10,
    total: 17280,
    count: 68,
  },
  {
    _id: 11,
    total: 15270,
    count: 61,
  },
  {
    _id: 12,
    total: 12630,
    count: 52,
  },
  {
    _id: 13,
    total: 11550,
    count: 45,
  },
  {
    _id: 14,
    total: 11630,
    count: 45,
  },
  {
    _id: 15,
    total: 15200,
    count: 61,
  },
  {
    _id: 16,
    total: 5600,
    count: 24,
  },
  {
    _id: 17,
    total: 9500,
    count: 35,
  },
  {
    _id: 18,
    total: 9850,
    count: 36,
  },
  {
    _id: 19,
    total: 6000,
    count: 23,
  },
  {
    _id: 20,
    total: 4150,
    count: 13,
  },
  {
    _id: 21,
    total: 9850,
    count: 35,
  },
  {
    _id: 22,
    total: 10050,
    count: 34,
  },
  {
    _id: 23,
    total: 4520,
    count: 19,
  },
  {
    _id: 24,
    total: 4870,
    count: 20,
  },
  {
    _id: 25,
    total: 4280,
    count: 17,
  },
  {
    _id: 26,
    total: 3750,
    count: 14,
  },
  {
    _id: 27,
    total: 4350,
    count: 20,
  },
];

export default function CollectionGrahp() {
  return (
    <>
      <div className="main-content">
        <section className="section">
          <div className="container pt-4 pb-2 mb-4 bg-white text-center border-rounded">
            <h4>কালেকশন গ্রাফ</h4>
          </div>
          <div className="container">
            <div className="row justify-content-center p-3 bg-white align-items-center"></div>
            <AreaChart
              width={800}
              height={500}
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </div>
        </section>
      </div>
    </>
  );
}
