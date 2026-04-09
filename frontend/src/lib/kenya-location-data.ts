export type KenyaArea = {
  name: string;
  latitude: number;
  longitude: number;
};

export type KenyaWard = {
  name: string;
  areas: KenyaArea[];
};

export type KenyaSubCounty = {
  name: string;
  wards: KenyaWard[];
};

export type KenyaCounty = {
  name: string;
  subCounties: KenyaSubCounty[];
};

export const kenyaLocationData: KenyaCounty[] = [
  {
    name: "Nairobi",
    subCounties: [
      {
        name: "Westlands",
        wards: [
          {
            name: "Parklands/Highridge",
            areas: [
              { name: "Parklands", latitude: -1.2626, longitude: 36.8169 },
              { name: "Highridge", latitude: -1.2549, longitude: 36.8048 },
            ],
          },
          {
            name: "Karura",
            areas: [
              { name: "Muthaiga North", latitude: -1.232, longitude: 36.8387 },
              { name: "Gigiri", latitude: -1.2294, longitude: 36.8051 },
            ],
          },
        ],
      },
      {
        name: "Kasarani",
        wards: [
          {
            name: "Roysambu",
            areas: [
              { name: "Roysambu", latitude: -1.2196, longitude: 36.8868 },
              { name: "Garden Estate", latitude: -1.2243, longitude: 36.8665 },
            ],
          },
          {
            name: "Mwiki",
            areas: [
              { name: "Mwiki", latitude: -1.2057, longitude: 36.9288 },
              { name: "Sunton", latitude: -1.2051, longitude: 36.9142 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Kiambu",
    subCounties: [
      {
        name: "Kiambaa",
        wards: [
          {
            name: "Karuri",
            areas: [
              { name: "Ruaka", latitude: -1.205, longitude: 36.7892 },
              { name: "Banana", latitude: -1.1835, longitude: 36.7098 },
            ],
          },
          {
            name: "Ndenderu",
            areas: [
              { name: "Ndenderu", latitude: -1.1975, longitude: 36.7451 },
              { name: "Muchatha", latitude: -1.2049, longitude: 36.7716 },
            ],
          },
        ],
      },
      {
        name: "Thika Town",
        wards: [
          {
            name: "Township",
            areas: [
              { name: "Makongeni", latitude: -1.0298, longitude: 37.0867 },
              { name: "Section 9", latitude: -1.0425, longitude: 37.0713 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Mombasa",
    subCounties: [
      {
        name: "Kisauni",
        wards: [
          {
            name: "Bamburi",
            areas: [
              { name: "Bamburi", latitude: -3.9797, longitude: 39.7316 },
              { name: "Vescon", latitude: -3.9668, longitude: 39.7414 },
            ],
          },
        ],
      },
      {
        name: "Nyali",
        wards: [
          {
            name: "Frere Town",
            areas: [
              { name: "Nyali", latitude: -4.0435, longitude: 39.6982 },
              { name: "Kongowea", latitude: -4.0411, longitude: 39.6867 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Kisumu",
    subCounties: [
      {
        name: "Kisumu Central",
        wards: [
          {
            name: "Market Milimani",
            areas: [
              { name: "Milimani", latitude: -0.0871, longitude: 34.7543 },
              { name: "Nyalenda", latitude: -0.111, longitude: 34.7612 },
            ],
          },
        ],
      },
    ],
  },
];
