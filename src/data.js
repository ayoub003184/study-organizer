export const starterCourses = [
  {code:'AIT202',name:'Methods and Applications of Deep Learning',color:'#f4c9d7'},
  {code:'AIT203',name:'Natural Language Processing',color:'#cfddfa'},
  {code:'CST306',name:'Principles of Operating Systems',color:'#f5dfad'},
  {code:'CST207',name:'Design and Analysis of Algorithms',color:'#cde9dc'},
  {code:'CST209',name:'Object-Oriented Programming – C++',color:'#decff3'}
];
// The source has alternate rooms/groups. The timetable groups these into one course card per day.
export const starterSessions = [
  {code:'AIT203',day_of_week:1,start_time:'12:00',end_time:'14:00',venue:'A4#G10',note:'Week 1–14'},
  {code:'AIT203',day_of_week:2,start_time:'13:00',end_time:'14:00',venue:'A5#G09',note:'Week 1–14'},
  {code:'AIT202',day_of_week:2,start_time:'10:00',end_time:'12:00',venue:'A1#G01',note:'Week 1–14'},
  {code:'AIT202',day_of_week:4,start_time:'15:00',end_time:'16:00',venue:'A1#G09',note:'Week 1–14'},
  {code:'CST306',day_of_week:2,start_time:'13:00',end_time:'15:00',venue:'A2#G06',note:'Option · Week 1–3'},
  {code:'CST306',day_of_week:3,start_time:'10:00',end_time:'12:00',venue:'A1#111',note:'Week 1–14'},
  {code:'CST306',day_of_week:3,start_time:'13:00',end_time:'15:00',venue:'A2#G06',note:'Option · Week 4–14'},
  {code:'CST207',day_of_week:5,start_time:'08:00',end_time:'10:00',venue:'A2#G04',note:'Week 1–14'},
  {code:'CST207',day_of_week:5,start_time:'09:00',end_time:'11:00',venue:'A1#G03',note:'Week 1–14 · alternative group'},
  {code:'CST209',day_of_week:1,start_time:'16:00',end_time:'18:00',venue:'A2#G06',note:'Week 1–14'},
  {code:'CST209',day_of_week:2,start_time:'16:00',end_time:'18:00',venue:'A1#G10',note:'Week 1–14'}
];
export const academicYears = {
  2026:{image:'/calendar/academic-2026.jpg',terms:[
    {name:'February semester',start:'2026-02-20',end:'2026-04-03',color:'#f6d1db'},
    {name:'April semester',start:'2026-04-03',end:'2026-07-31',color:'#c9e4f7'},
    {name:'September semester',start:'2026-09-25',end:'2027-01-21',color:'#d2e8cd'}],
    milestones:[['Registration','2026-09-25','2026-09-26'],['Orientation','2026-09-27','2026-09-27'],['Revision','2027-01-04','2027-01-10'],['Examinations','2027-01-11','2027-01-21'],['Semester break','2027-01-23','2027-02-11']],
    holidays:[
      ['2026-02-17','2026-02-18','Chinese New Year'],['2026-03-07','2026-03-07','Nuzul Al-Quran'],
      ['2026-03-21','2026-03-23','Hari Raya Aidilfitri'],['2026-05-01','2026-05-01','Labour Day'],
      ['2026-05-27','2026-05-27','Hari Raya Haji'],['2026-05-31','2026-05-31','Wesak Day'],
      ['2026-06-01','2026-06-01',"Agong’s Birthday"],['2026-06-17','2026-06-17','Awal Muharram'],
      ['2026-08-25','2026-08-25',"Prophet Muhammad’s Birthday"],['2026-08-31','2026-08-31','Merdeka Day'],
      ['2026-09-16','2026-09-16','Malaysia Day'],['2026-11-08','2026-11-09','Deepavali'],
      ['2026-12-11','2026-12-11',"Sultan of Selangor’s Birthday"],['2026-12-25','2026-12-25','Christmas Day']
    ]},
  2027:{image:'/calendar/academic-2027.jpg',terms:[
    {name:'February semester',start:'2027-02-12',end:'2027-03-26',color:'#f6d1db'},
    {name:'April semester',start:'2027-03-26',end:'2027-07-23',color:'#c9e4f7'},
    {name:'September semester',start:'2027-09-17',end:'2028-01-14',color:'#d2e8cd'}],
    milestones:[['Examinations · February','2027-03-22','2027-03-26'],['Revision · April','2027-07-05','2027-07-11'],['Examinations · April','2027-07-12','2027-07-23'],['Semester break','2027-07-24','2027-09-16'],['Revision · September','2027-12-27','2028-01-02'],['Examinations · September','2028-01-03','2028-01-14']],
    holidays:[
      ['2027-01-01','2027-01-01',"New Year’s Day"],['2027-01-22','2027-01-22','Thaipusam'],
      ['2027-02-06','2027-02-08','Chinese New Year'],['2027-02-24','2027-02-24','Nuzul Al-Quran'],
      ['2027-03-10','2027-03-11','Hari Raya Aidilfitri'],['2027-05-01','2027-05-01','Labour Day'],
      ['2027-05-17','2027-05-17','Hari Raya Haji'],['2027-05-20','2027-05-20','Wesak Day'],
      ['2027-06-06','2027-06-07','Awal Muharram'],['2027-06-07','2027-06-07',"Agong’s Birthday"],
      ['2027-08-15','2027-08-16',"Prophet Muhammad’s Birthday"],['2027-08-31','2027-08-31','Merdeka Day'],
      ['2027-09-16','2027-09-16','Malaysia Day'],['2027-10-28','2027-10-28','Deepavali'],
      ['2027-12-11','2027-12-11',"Sultan of Selangor’s Birthday"],['2027-12-25','2027-12-25','Christmas Day']
    ]}
};
