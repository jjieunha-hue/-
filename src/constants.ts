/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, FestivalItem, AboutInfo } from './types';

export const INITIAL_ABOUT: AboutInfo = {
  name: "HA JI EUN",
  title: "Spatial & Graphic Experience",
  highlight: "공간의 정체성을 시각적으로 풀어내는 환경 디자이너 \n하지은입니다.",
  description: "건축적 사고와 산업 디자인의 정교함을 기반으로 공공 디자인, 환경 디자인, 브랜딩을 수행합니다. 공간이 가진 역사와 지역의 목소리를 담아내는 것에 집중하며, 3D 시각화 역량을 통해 실제 시공 전 최적화된 결과물을 제안합니다. 단순히 아름다운 공간을 넘어, 그곳에 머무는 사람들의 경험과 감정을 디자인하는 것을 목표로 합니다. 도시의 틈새를 메우는 공공 예술부터 브랜드의 철학을 담은 인테리어까지, 다양한 스케일의 프로젝트를 통해 공간의 가치를 증명하고 있습니다.",
  phone: "010.2977.5281",
  email: "jeeeunha@naver.com",
  social: {
    instagram: "https://instagram.com",
    behance: "https://behance.net",
    notion: "https://notion.so"
  },
  projectInfoLabel: 'Project Info',
  timelineLabel: 'Timeline',
  categoryLabel: 'Category',
  tagsLabel: 'Tags',
  festivalTitle: 'EXPERIENCE',
  experiences: [
    { id: 'exp1', company: "콜링씨앤디 (Calling C&D)", period: "2026.03 - 현재" },
    { id: 'exp2', company: "더가꿈 (The Gakkum)", period: "2025.11 - 2026.01" },
    { id: 'exp_sid', company: "SID연구소", period: "2024.03 - 2024.11" },
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
    projectInfoRich: 'Environmental Design',
    imageUrl: "https://picsum.photos/seed/nsquare-main/800/600",
    completedImages: [
      "https://picsum.photos/seed/nsquare-site-1/1200/800"
    ],
    design2DImages: [
      "https://picsum.photos/seed/nsquare-2d-1/1200/800",
      "https://picsum.photos/seed/nsquare-2d-2/1200/800",
      "https://picsum.photos/seed/nsquare-2d-3/1200/800",
      "https://picsum.photos/seed/nsquare-2d-4/1200/800",
      "https://picsum.photos/seed/nsquare-2d-5/1200/800",
      "https://picsum.photos/seed/nsquare-2d-6/1200/800",
      "https://picsum.photos/seed/nsquare-2d-7/1200/800",
      "https://picsum.photos/seed/nsquare-2d-8/1200/800"
    ],
    icon: 'fa-monument',
    order: 1
  },
  {
    id: 'gandhi',
    title: "Gandhi Memorial Park",
    subtitle: "기억과 사색을 위한 공공 공간 기획",
    period: "2019-2020",
    description: "마하트마 간디 탄생 150주년을 기념하여 인도 정부에서 기증받은 동상을 중심으로 사색의 공간을 기획했습니다. 김해 연지공원 내에 조성되었습니다.",
    tags: ["Spatial Design", "2019-2020"],
    category: 'environmental',
    imageUrl: "https://picsum.photos/seed/gandhi-main/800/600",
    completedImages: [
      "https://picsum.photos/seed/gandhi-site-1/1200/800"
    ],
    design2DImages: [
      "https://picsum.photos/seed/gandhi-2d-1/1200/800",
      "https://picsum.photos/seed/gandhi-2d-2/1200/800"
    ],
    design3DImages: [
      "https://picsum.photos/seed/gandhi-3d-1/1200/800"
    ],
    icon: 'fa-peace',
    order: 2
  },
  {
    id: 'oedeok',
    title: "New Village Project",
    subtitle: "참여형 예술을 통한 골목의 재탄생",
    period: "2020",
    description: "주민참여예산 사업의 일환으로 진행된 마을 재생 프로젝트입니다. '화목하고 정이 넘치는 마을' 키워드를 담은 벽화 디자인입니다.",
    tags: ["Wall Design", "2020"],
    category: 'environmental',
    imageUrl: "https://picsum.photos/seed/oedeok-main/800/600",
    completedImages: [
      "https://picsum.photos/seed/oedeok-site-1/1200/800"
    ],
    design2DImages: [
      "https://picsum.photos/seed/oedeok-2d-1/1200/800",
      "https://picsum.photos/seed/oedeok-2d-2/1200/800",
      "https://picsum.photos/seed/oedeok-2d-3/1200/800",
      "https://picsum.photos/seed/oedeok-2d-4/1200/800",
      "https://picsum.photos/seed/oedeok-2d-5/1200/800",
      "https://picsum.photos/seed/oedeok-2d-6/1200/800"
    ],
    icon: 'fa-house-chimney',
    order: 3
  },
  {
    id: 'dongju',
    title: "동주중학교 옹벽 디자인 개선사업",
    subtitle: "부산 사상구 동주중학교 옹벽 경관 개선 실시설계",
    period: "2024.10",
    description: "노후화된 동주중학교 옹벽의 디자인을 개선하여 쾌적한 도시 미관을 조성하고, 학교의 상징물과 학생들의 일상을 담아낸 경관 개선 프로젝트입니다. 좁은 보행 환경을 고려하여 보행자의 시야를 방해하지 않으면서도 학교의 정체성을 살린 디자인을 제안했습니다.",
    details: [
      "학교의 상징물인 느티나무(교목)와 개나리(교화), 해와 산 등을 아이콘화하여 부조 타일로 표현하고, 배경은 이형 모자이크 타일로 처리하여 입체감을 더했습니다.",
      "학생들의 등교부터 하교까지의 하루를 시간 순서대로 구성하여 스토리텔링이 있는 벽면을 기획했습니다.",
      "전체적으로 파스텔 톤의 밝고 따뜻한 색채 계획을 통해 지역사회와 조화로우면서도 학생들에게 친숙한 등하굣길 환경을 조성했습니다."
    ],
    tags: ["Public Design", "Landscape", "Environmental Design"],
    category: 'environmental',
    imageUrl: "https://picsum.photos/seed/dongju-main/800/600",
    design2DImages: [
      "https://picsum.photos/seed/dongju-2d-1/1200/800",
      "https://picsum.photos/seed/dongju-2d-2/1200/800"
    ],
    design3DImages: [
      "https://picsum.photos/seed/dongju-3d-1/1200/800",
      "https://picsum.photos/seed/dongju-3d-2/1200/800",
      "https://picsum.photos/seed/dongju-3d-3/1200/800",
      "https://picsum.photos/seed/dongju-3d-4/1200/800",
      "https://picsum.photos/seed/dongju-3d-5/1200/800",
      "https://picsum.photos/seed/dongju-3d-6/1200/800",
      "https://picsum.photos/seed/dongju-3d-7/1200/800",
      "https://picsum.photos/seed/dongju-3d-8/1200/800",
      "https://picsum.photos/seed/dongju-3d-9/1200/800"
    ],
    icon: 'fa-school',
    order: 4
  },
  {
    id: 'int1',
    title: "Employment Center Remodeling",
    subtitle: "부산 진구청 취업정보센터 인테리어",
    period: "2024-2025",
    description: "부산 진구청 내 취업정보센터의 공간 효율성을 높이고 시민 친화적인 환경을 조성하기 위한 리모델링 프로젝트입니다. 밝고 신뢰감 있는 분위기를 구현하기 위해 공간 구조 및 마감재를 새롭게 기획했습니다.",
    details: [
      "기존의 노후화된 사무 환경을 개선하여 방문객들이 편안하게 상담받을 수 있는 개방형 라운지 구조를 도입했습니다.",
      "진구청의 브랜드 컬러를 포인트로 활용하여 아이덴티티를 강화하고, 목재 소재를 사용하여 따뜻하고 신뢰감 있는 분위기를 연출했습니다.",
      "상담 창구의 프라이버시를 확보하면서도 전체적인 개방감을 유지할 수 있는 파티션 디자인을 적용했습니다."
    ],
    tags: ["Public Interior", "Remodeling"],
    category: 'interior',
    imageUrl: "https://picsum.photos/seed/employment-center-main/800/600",
    completedImages: [
      "https://picsum.photos/seed/employment-center-site-1/1200/800",
      "https://picsum.photos/seed/employment-center-site-2/1200/800",
      "https://picsum.photos/seed/employment-center-site-3/1200/800",
      "https://picsum.photos/seed/employment-center-site-4/1200/800",
      "https://picsum.photos/seed/employment-center-site-5/1200/800",
      "https://picsum.photos/seed/employment-center-site-6/1200/800",
      "https://picsum.photos/seed/employment-center-site-7/1200/800",
      "https://picsum.photos/seed/employment-center-site-8/1200/800",
      "https://picsum.photos/seed/employment-center-site-9/1200/800",
      "https://picsum.photos/seed/employment-center-site-10/1200/800",
      "https://picsum.photos/seed/employment-center-site-11/1200/800",
      "https://picsum.photos/seed/employment-center-site-12/1200/800",
      "https://picsum.photos/seed/employment-center-site-13/1200/800",
      "https://picsum.photos/seed/employment-center-site-14/1200/800",
      "https://picsum.photos/seed/employment-center-site-15/1200/800",
      "https://picsum.photos/seed/employment-center-site-16/1200/800"
    ],
    design3DImages: [
      "https://picsum.photos/seed/employment-center-3d-1/1200/800",
      "https://picsum.photos/seed/employment-center-3d-2/1200/800",
      "https://picsum.photos/seed/employment-center-3d-3/1200/800",
      "https://picsum.photos/seed/employment-center-3d-4/1200/800",
      "https://picsum.photos/seed/employment-center-3d-5/1200/800",
      "https://picsum.photos/seed/employment-center-3d-6/1200/800",
      "https://picsum.photos/seed/employment-center-3d-7/1200/800"
    ],
    icon: 'fa-building',
    order: 5
  },
  {
    id: 'int2',
    title: "IBK Bank Office Remodeling",
    subtitle: "부산 IBK 저축은행 본점 사무실 부분 리모델링",
    period: "2024-2025",
    description: "IBK 저축은행 본점 사무 공간의 부분 리모델링 프로젝트입니다. 현대적인 사무 환경과 기업 이미지를 통합하여 업무 몰입도를 높일 수 있는 쾌적한 공간 디자인을 제안했습니다.",
    details: [
      "기존의 경직된 사무 공간을 유연하고 소통이 원활한 환경으로 재구성했습니다.",
      "기업의 신뢰도를 상징하는 블루 톤과 차분한 그레이 톤을 조화롭게 배치하여 전문적인 분위기를 조성했습니다.",
      "직원들의 휴식과 짧은 미팅이 가능한 탕비실 및 라운지 공간을 새롭게 디자인하여 업무 효율성을 높였습니다."
    ],
    tags: ["Office Interior", "Office Remodeling"],
    category: 'interior',
    imageUrl: "https://picsum.photos/seed/ibk-bank-main/800/600",
    completedImages: [
      "https://picsum.photos/seed/ibk-bank-site-1/1200/800",
      "https://picsum.photos/seed/ibk-bank-site-2/1200/800"
    ],
    design3DImages: [
      "https://picsum.photos/seed/ibk-bank-3d-1/1200/800",
      "https://picsum.photos/seed/ibk-bank-3d-2/1200/800",
      "https://picsum.photos/seed/ibk-bank-3d-3/1200/800",
      "https://picsum.photos/seed/ibk-bank-3d-4/1200/800"
    ],
    icon: 'fa-landmark',
    order: 6
  },
  {
    id: 'others1',
    title: "41대 여운 : 餘運\n총 학생회\n선거운동본부",
    subtitle: "로고 디자인",
    period: "2024",
    description: "제 41대 '여운 : 餘運' 총 학생회 선거운동본부의 아이덴티티를 구축하기 위한 로고 초안 프로젝트입니다. '여운'이 가진 의미를 세 가지 시각적 방향성으로 풀어내어 브랜드의 핵심 가치를 전달하고자 했습니다.",
    details: [
      "시안 1: 팔각형 형태의 도형 안에 '餘運' 한자를 깔끔하게 배치하여 심플하고 정갈한 형태의 로고를 표현했습니다.",
      "시안 2: '餘運' 한자를 가운데에 넣어 강조하고, 뒤의 파도와 물을 연상시키는 원형 요소와 조화롭게 배치하여 유연한 이미지를 담았습니다.",
      "시안 3: '餘運' 한자를 독특한 폰트와 물결 패턴을 이용하여 심플하면서도 레트로한 분위기를 자아내는 독창적인 로고로 구현했습니다."
    ],
    designImages: [
      "https://picsum.photos/seed/yeoun-logo-1/1200/800",
      "https://picsum.photos/seed/yeoun-logo-2/1200/800",
      "https://picsum.photos/seed/yeoun-logo-3/1200/800"
    ],
    tags: ["Branding", "Logo Design", "Identity"],
    category: 'others',
    icon: 'fa-pen-nib',
    order: 7
  },
  {
    id: 'others2',
    title: "Editorial Design",
    subtitle: "달력 & 프로모션 디자인",
    period: "2023",
    description: "",
    designImages: [
      "https://picsum.photos/seed/calendar-1/1200/800",
      "https://picsum.photos/seed/calendar-2/1200/800",
      "https://picsum.photos/seed/calendar-3/1200/800"
    ],
    tags: ["Editorial", "Graphic"],
    category: 'others',
    icon: 'fa-calendar-days',
    order: 8
  }
];

export const INITIAL_FESTIVALS: FestivalItem[] = [
  { 
    id: 'f1', 
    title: '2022 해운대구 랙처콘서트', 
    sub: '음악과 함께 들려주는 넓고 깊은 예술이야기', 
    order: 1,
    description: "해운대구에서 진행된 인문학 강연과 클래식 공연이 결합된 랙처콘서트 시리즈의 통합 브랜딩 및 홍보물 디자인입니다. 예술의 깊이를 시각적으로 전달하기 위해 클래식한 타이포그래피와 현대적인 그래픽 요소를 조화롭게 사용했습니다.",
    period: "2022.05 - 2022.11",
    tags: ["Branding", "Promotion", "2022"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f2', 
    title: '2022 부산중구 유라리네컷', 
    sub: 'Interaction Design & Identity', 
    order: 2,
    description: "부산 중구 유라리광장에서 진행된 시민 참여형 인터랙션 디자인 프로젝트입니다. '유라리네컷'이라는 컨셉으로 광장의 기억을 기록하고 공유하는 아이덴티티를 구축했습니다.",
    period: "2022.08",
    tags: ["Interaction", "Identity", "2022"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f3', 
    title: '2022년 자매결연도시·우호교류도시 농·특산물 직거래장터', 
    sub: '프로모션 디자인', 
    order: 3,
    description: "전국 각지의 자매결연 도시들이 참여하는 직거래 장터의 통합 프로모션 디자인입니다. 활기찬 시장의 분위기와 각 지역의 특색을 담은 비주얼 아이덴티티를 제안했습니다.",
    period: "2022.09",
    tags: ["Promotion", "Graphic", "2022"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f4', 
    title: '2022 부산대 인문학축제', 
    sub: '페스티벌 아이덴티티', 
    order: 4,
    description: "부산대학교에서 개최된 인문학 축제의 메인 아이덴티티 디자인입니다. '생각의 깊이, 대화의 즐거움'을 키워드로 하여 지적인 호기심을 자극하는 그래픽 시스템을 구축했습니다.",
    period: "2022.10",
    tags: ["Festival", "Identity", "2022"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f5', 
    title: '2023 해운대카운트다운 & 해맞이축제', 
    sub: '시즌 통합 브랜딩', 
    order: 5,
    description: "해운대의 대표적인 연말연시 축제인 카운트다운과 해맞이 축제의 통합 브랜딩입니다. 새로운 시작의 설렘과 희망을 담은 역동적인 그래픽을 통해 축제의 에너지를 전달했습니다.",
    period: "2022.12 - 2023.01",
    tags: ["Branding", "Season", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f6', 
    title: '2023 부산 해운대 EXPO 유치 실사대비', 
    sub: '공공 프로모션 디자인', 
    order: 6,
    description: "2030 부산 세계박람회 유치를 위한 국제박람회기구(BIE) 실사단 방문에 대비한 해운대구 일원의 공공 프로모션 디자인입니다. 글로벌 도시 해운대의 이미지를 강조하는 가로 환경 디자인을 수행했습니다.",
    period: "2023.03 - 2023.04",
    tags: ["Public", "Promotion", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f7', 
    title: '2023 해운대 모래축제', 
    sub: '주요 축제 브랜딩', 
    order: 7,
    description: "해운대 모래축제의 메인 아이덴티티 및 온/오프라인 홍보물 디자인입니다. 모래라는 소재의 질감과 축제의 즐거움을 시각화하여 방문객들에게 일관된 브랜드 경험을 제공했습니다.",
    period: "2023.05",
    tags: ["Festival", "Branding", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f8', 
    title: '2023 송정해수욕장 개장식', 
    sub: '관광 및 아이덴티티 디자인', 
    order: 8,
    description: "송정해수욕장 개장식의 메인 비주얼 및 현장 설치물 디자인입니다. 서핑의 성지인 송정의 아이덴티티를 반영하여 젊고 감각적인 무드를 연출했습니다.",
    period: "2023.06",
    tags: ["Identity", "Tourism", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f9', 
    title: '2023 해운대 청춘난장', 
    sub: '청년 문화 브랜딩', 
    order: 9,
    description: "청년 예술가들의 열정과 문화를 공유하는 '청춘난장' 페스티벌의 브랜딩입니다. 자유롭고 실험적인 청년 문화를 대변하는 과감한 타이포그래피와 컬러를 사용했습니다.",
    period: "2023.08",
    tags: ["Youth", "Culture", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f10', 
    title: '2023 수영구 평생학습축제', 
    sub: '교육 페스티벌 아이덴티티', 
    order: 10,
    description: "수영구 평생학습축제의 아이덴티티 디자인입니다. 전 세대가 함께 배우고 즐기는 축제의 의미를 담아 친근하고 따뜻한 일러스트 기반의 그래픽을 제안했습니다.",
    period: "2023.09",
    tags: ["Education", "Identity", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f11', 
    title: '2023 가을햇살 태교음악회', 
    sub: '문화 콘서트 브랜딩', 
    order: 11,
    description: "임산부와 가족을 위한 태교음악회의 브랜딩 및 홍보 디자인입니다. 가을의 서정적인 분위기와 생명의 소중함을 담은 부드러운 톤앤매너를 구축했습니다.",
    period: "2023.10",
    tags: ["Concert", "Branding", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f12', 
    title: '2023 영도다리축제', 
    sub: '지역 유산 축제 디자인', 
    order: 12,
    description: "부산의 역사적 상징인 영도다리를 테마로 한 축제의 통합 디자인입니다. 과거와 현재를 잇는 다리의 의미를 현대적인 그래픽 언어로 재해석했습니다.",
    period: "2023.10",
    tags: ["Heritage", "Festival", "2023"],
    sub_category: 'FESTIVAL'
  },
  { 
    id: 'f13', 
    title: '2023 해운대 꿈꾸는마을축제', 
    sub: '커뮤니티 프로젝트 아이덴티티', 
    order: 13,
    description: "마을 공동체의 화합을 위한 꿈꾸는마을축제의 아이덴티티 디자인입니다. 주민들이 직접 참여하고 만들어가는 축제의 생동감을 담아냈습니다.",
    period: "2023.11",
    tags: ["Community", "Identity", "2023"],
    sub_category: 'FESTIVAL'
  }
];
