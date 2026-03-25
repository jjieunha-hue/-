/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, FestivalItem, AboutInfo } from './types';

export const INITIAL_ABOUT: AboutInfo = {
  name: "HA JI EUN",
  title: "Spatial & Graphic Experience",
  highlight: "공간의 정체성을 시각적으로 풀어내는 환경 디자이너 하지은입니다.",
  description: "건축적 사고와 산업 디자인의 정교함을 기반으로 공공 디자인, 환경 디자인, 브랜딩을 수행합니다. 공간이 가진 역사와 지역의 목소리를 담아내는 것에 집중하며, 3D 시각화 역량을 통해 실제 시공 전 최적화된 결과물을 제안합니다.",
  phone: "010.2977.5281",
  email: "jeeeunha@naver.com",
  experiences: [
    { id: 'exp1', company: "콜링씨앤디 (Calling C&D)", period: "2026.03 - 현재" },
    { id: 'exp2', company: "더가꿈 (The Gakkum)", period: "2025.11 - 2026.01" },
    { id: 'exp3', company: "Wrecking Ball Art Community", period: "2022.07 - 2023.10", opacity: 70 },
    { id: 'exp4', company: "Raon Design Lab", period: "2019.10 - 2020.06", opacity: 70 },
    { id: 'exp5', company: "Dongmyung University", period: "2015.03 - 2019.02 Graduation", opacity: 50 },
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'nsquare',
    title: "Cultural Breath",
    subtitle: "도시 경관을 채우는 역사적 시각화",
    period: "2019",
    description: "공사 현장의 삭막한 울타리를 김해 수로왕릉, 한옥체험관 등 지역의 역사적 랜드마크를 활용한 갤러리로 변모시킨 프로젝트입니다.",
    tags: ["Public Art", "2019"],
    category: 'environmental',
    icon: 'fa-monument'
  },
  {
    id: 'gandhi',
    title: "Gandhi Memorial Park",
    subtitle: "기억과 사색을 위한 공공 공간 기획",
    period: "2019-2020",
    description: "마하트마 간디 탄생 150주년을 기념하여 인도 정부에서 기증받은 동상을 중심으로 사색의 공간을 기획했습니다. 김해 연지공원 내에 조성되었습니다.",
    tags: ["Spatial Design", "2019-2020"],
    category: 'environmental',
    icon: 'fa-peace'
  },
  {
    id: 'oedeok',
    title: "New Village Project",
    subtitle: "참여형 예술을 통한 골목의 재탄생",
    period: "2020",
    description: "주민참여예산 사업의 일환으로 진행된 마을 재생 프로젝트입니다. '화목하고 정이 넘치는 마을' 키워드를 담은 벽화 디자인입니다.",
    tags: ["Wall Design", "2020"],
    category: 'environmental',
    icon: 'fa-house-chimney'
  },
  {
    id: 'dongju',
    title: "Dongju Middle School",
    subtitle: "감성과 안전을 담은 등하굣길 설계",
    period: "2024.10",
    description: "동주중학교 일원 옹벽의 디자인을 개선하여 쾌적한 도시미관을 조성하는 프로젝트입니다. 'Slow step, Green energy' 컨셉으로 학교 상징물(느티나무, 개나리)을 패턴화하여 입체적인 가로 환경을 구축했습니다.",
    tags: ["Public Design", "2024.10"],
    category: 'environmental',
    icon: 'fa-school'
  },
  {
    id: 'int1',
    title: "Employment Center Remodeling",
    subtitle: "부산 진구청 취업정보센터 인테리어",
    period: "2024-2025",
    description: "부산 진구청 내 취업정보센터의 공간 효율성을 높이고 시민 친화적인 환경을 조성하기 위한 리모델링 프로젝트입니다. 밝고 신뢰감 있는 분위기를 구현하기 위해 공간 구조 및 마감재를 새롭게 기획했습니다.",
    tags: ["Public Interior", "Remodeling"],
    category: 'interior',
    icon: 'fa-building'
  },
  {
    id: 'int2',
    title: "IBK Bank Office Remodeling",
    subtitle: "부산 IBK 저축은행 본점 사무실 부분 리모델링",
    period: "2024-2025",
    description: "IBK 저축은행 본점 사무 공간의 부분 리모델링 프로젝트입니다. 현대적인 사무 환경과 기업 이미지를 통합하여 업무 몰입도를 높일 수 있는 쾌적한 공간 디자인을 제안했습니다.",
    tags: ["Office Interior", "Office Remodeling"],
    category: 'interior',
    icon: 'fa-landmark'
  },
  {
    id: 'others1',
    title: "Logo Design Archive",
    subtitle: "브랜드 아이덴티티 & 타이포그래피",
    period: "2022-2024",
    description: "기업 및 행사의 아이덴티티를 담은 로고 디자인 모음입니다.",
    tags: ["Branding", "Logo"],
    category: 'others',
    icon: 'fa-pen-nib'
  },
  {
    id: 'others2',
    title: "Editorial Design",
    subtitle: "달력 & 프로모션 디자인",
    period: "2023",
    description: "시즌별 프로모션을 위한 달력 및 인쇄물 통합 디자인입니다.",
    tags: ["Editorial", "Graphic"],
    category: 'others',
    icon: 'fa-calendar-days'
  }
];

export const INITIAL_FESTIVALS: FestivalItem[] = [
  { id: 'f1', title: '2022 해운대구 랙처콘서트', sub: '음악과 함께 들려주는 넓고 깊은 예술이야기', order: 1 },
  { id: 'f2', title: '2022 부산중구 유라리네컷', sub: 'Interaction Design & Identity', order: 2 },
  { id: 'f3', title: '2022년 자매결연도시·우호교류도시 농·특산물 직거래장터', sub: '프로모션 디자인', order: 3 },
  { id: 'f4', title: '2022 부산대 인문학축제', sub: '페스티벌 아이덴티티', order: 4 },
  { id: 'f5', title: '2023 해운대카운트다운 & 해맞이축제', sub: '시즌 통합 브랜딩', order: 5 },
  { id: 'f6', title: '2023 부산 해운대 EXPO 유치 실사대비', sub: '공공 프로모션 디자인', order: 6 },
  { id: 'f7', title: '2023 해운대 모래축제', sub: '주요 축제 브랜딩', order: 7 },
  { id: 'f8', title: '2023 송정해수욕장 개장식', sub: '관광 및 아이덴티티 디자인', order: 8 },
  { id: 'f9', title: '2023 해운대 청춘난장', sub: '청년 문화 브랜딩', order: 9 },
  { id: 'f10', title: '2023 수영구 평생학습축제', sub: '교육 페스티벌 아이덴티티', order: 10 },
  { id: 'f11', title: '2023 가을햇살 태교음악회', sub: '문화 콘서트 브랜딩', order: 11 },
  { id: 'f12', title: '2023 영도다리축제', sub: '지역 유산 축제 디자인', order: 12 },
  { id: 'f13', title: '2023 해운대 꿈꾸는마을축제', sub: '커뮤니티 프로젝트 아이덴티티', order: 13 }
];
