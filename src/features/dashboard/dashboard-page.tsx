import {
    AlertCircle,
    CreditCard,
    GraduationCap,
    Plus,
    Sparkles,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react'
import {Button} from '#/components/ui/button'
import {usePermission} from '#/features/auth/hooks/use-permission'

export function DashboardPage() {
    const {user} = usePermission()

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* ===================== WELCOME HEADER ===================== */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Sparkles className="w-3 h-3"/>
                        <span>Academic Year 2024-2025 • Term 2</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Welcome back, {user?.name} 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Here is a summary of today's campus operations and academic activities.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
                        <Plus className="w-4 h-4"/>
                        Enroll Student
                    </Button>
                </div>
            </div>

            {/* ===================== KPI STATS CARDS ===================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        title: 'Total Students',
                        value: '2,480',
                        change: '+12% from last term',
                        icon: GraduationCap,
                        color: 'text-primary bg-primary/10',
                    },
                    {
                        title: 'Faculty & Staff',
                        value: '142',
                        change: 'Full department coverage',
                        icon: Users,
                        color: 'text-indigo-600 bg-indigo-500/10',
                    },
                    {
                        title: 'Daily Attendance',
                        value: '96.4%',
                        change: '2,390 present today',
                        icon: UserCheck,
                        color: 'text-emerald-600 bg-emerald-500/10',
                    },
                    {
                        title: 'Fee Collection',
                        value: '$184,200',
                        change: '88% of term collected',
                        icon: CreditCard,
                        color: 'text-amber-600 bg-amber-500/10',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                            <div className={`p-2.5 rounded-xl ${stat.color}`}>
                                <stat.icon className="w-4 h-4"/>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0"/>
                                <span>{stat.change}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ===================== MAIN CONTENT GRID ===================== */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* 2-Column Left: Attendance & Recent Enrollments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Attendance Visual Card */}
                    <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Weekly Attendance Overview</h3>
                                <p className="text-xs text-muted-foreground">Class presence across Monday - Friday</p>
                            </div>
                            <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600">
                                95.8% Avg
                            </span>
                        </div>

                        {/* Bar Graph Simulation */}
                        <div className="grid grid-cols-5 gap-3 pt-4 items-end h-40 border-b border-border/60 pb-3">
                            {[
                                {day: 'Mon', pct: 98},
                                {day: 'Tue', pct: 96},
                                {day: 'Wed', pct: 94},
                                {day: 'Thu', pct: 97},
                                {day: 'Fri', pct: 92},
                            ].map((bar, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                                    <span
                                        className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                        {bar.pct}%
                                    </span>
                                    <div
                                        className="w-full bg-primary/20 group-hover:bg-primary rounded-t-lg transition-all duration-300"
                                        style={{height: `${bar.pct}%`}}
                                    />
                                    <span className="text-xs font-medium text-muted-foreground">{bar.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Admissions List */}
                    <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-foreground">Recent Enrollments</h3>
                                <p className="text-xs text-muted-foreground">New students admitted this week</p>
                            </div>
                        </div>

                        <div className="divide-y divide-border/60">
                            {[
                                {name: 'Sophia Miller', grade: 'Grade 10-A', id: 'STU-9021', date: 'Today, 09:30 AM'},
                                {name: 'Lucas Hernandez', grade: 'Grade 8-B', id: 'STU-9022', date: 'Yesterday'},
                                {
                                    name: 'Amara Johnson',
                                    grade: 'Grade 11-Science',
                                    id: 'STU-9023',
                                    date: 'May 12, 2025'
                                },
                                {name: 'Ethan Patel', grade: 'Grade 9-C', id: 'STU-9024', date: 'May 10, 2025'},
                            ].map((student, idx) => (
                                <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-foreground">
                                            {student.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-foreground">{student.name}</p>
                                            <p className="text-[10px] text-muted-foreground">{student.id} • {student.grade}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-muted-foreground">{student.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 1-Column Right: Schedule, Notices & Shortcuts */}
                <div className="space-y-6">
                    {/* Notice Board */}
                    <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-foreground">Notice Board</h3>
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">3 New</span>
                        </div>

                        <div className="space-y-3">
                            {[
                                {title: 'Mid-term Exam Schedule Published', time: '2 hours ago', urgent: true},
                                {title: 'Parent-Teacher Meeting next Friday', time: '1 day ago', urgent: false},
                                {title: 'Annual Science Fair Registration open', time: '3 days ago', urgent: false},
                            ].map((notice, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-start gap-2">
                                        {notice.urgent &&
                                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5"/>}
                                        <p className="text-xs font-semibold text-foreground leading-snug">{notice.title}</p>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground pl-5.5">{notice.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-foreground">Upcoming Schedule</h3>

                        <div className="space-y-3">
                            {[
                                {date: 'MAY 18', event: 'Physics Practical Lab 1', class: 'Grade 12-A'},
                                {date: 'MAY 20', event: 'Staff Departmental Meeting', class: 'All Faculty'},
                                {date: 'MAY 25', event: 'Tuition Fee Deadline Term 2', class: 'Accounts'},
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3.5">
                                    <div
                                        className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center font-bold shrink-0">
                                        <span
                                            className="text-[10px] uppercase leading-none">{item.date.split(' ')[0]}</span>
                                        <span className="text-sm leading-none mt-0.5">{item.date.split(' ')[1]}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-foreground truncate">{item.event}</p>
                                        <p className="text-[11px] text-muted-foreground">{item.class}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}