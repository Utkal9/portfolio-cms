import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    ChevronDown,
    ChevronUp,
    BookOpen,
    GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import { semesterAPI } from "../../services/api.js";

const GRADES = ["O", "A+", "A", "B+", "B", "C", "F", "IP"];
const GRADE_POINTS = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
    F: 0,
    IP: null, // In Progress
};

const EMPTY_COURSE = { code: "", name: "", credits: 3, grade: "O" };
const EMPTY_SEM = { semester: 1, year: "", label: "", courses: [] };

function calcSGPA(courses) {
    const graded = courses.filter((c) => c.grade !== "IP");
    const tc = graded.reduce((s, c) => s + Number(c.credits), 0);
    const tp = graded.reduce(
        (s, c) => s + Number(c.credits) * (GRADE_POINTS[c.grade] || 0),
        0,
    );
    return tc > 0 ? (tp / tc).toFixed(2) : "0.00";
}

function CourseRow({ course, index, onChange, onDelete }) {
    const inputCls = `px-2.5 py-2 rounded-lg text-sm bg-dark-bg border border-dark-border
    text-slate-200 placeholder:text-slate-600
    focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="grid grid-cols-12 gap-2 items-center py-2
        border-b border-dark-border/50 last:border-0"
        >
            <div className="col-span-2">
                <input
                    value={course.code}
                    onChange={(e) => onChange(index, "code", e.target.value)}
                    className={inputCls + " w-full font-mono text-xs"}
                    placeholder="CS101"
                />
            </div>
            <div className="col-span-5">
                <input
                    value={course.name}
                    onChange={(e) => onChange(index, "name", e.target.value)}
                    className={inputCls + " w-full"}
                    placeholder="Data Structures"
                />
            </div>
            <div className="col-span-2">
                <input
                    type="number"
                    min={1}
                    max={6}
                    value={course.credits}
                    onChange={(e) =>
                        onChange(index, "credits", Number(e.target.value))
                    }
                    className={inputCls + " w-full text-center"}
                />
            </div>
            <div className="col-span-2">
                <select
                    value={course.grade}
                    onChange={(e) => onChange(index, "grade", e.target.value)}
                    className={inputCls + " w-full"}
                >
                    {GRADES.map((g) => (
                        <option key={g} value={g}>
                            {g === "IP" ? "⏳ In Progress" : g}
                        </option>
                    ))}
                </select>
            </div>
            <div className="col-span-1 flex justify-center">
                <button
                    onClick={() => onDelete(index)}
                    className="w-7 h-7 rounded-lg text-slate-600
            hover:text-red-400 hover:bg-red-400/10
            flex items-center justify-center transition-all"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </motion.div>
    );
}

function SemesterForm({ initial, onSave, onCancel, saving }) {
    const [form, setForm] = useState({
        ...EMPTY_SEM,
        ...initial,
        courses: initial?.courses?.map((c) => ({ ...c })) || [],
    });

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const addCourse = () =>
        setForm((f) => ({
            ...f,
            courses: [...f.courses, { ...EMPTY_COURSE }],
        }));

    const updateCourse = (i, k, v) =>
        setForm((f) => {
            const courses = [...f.courses];
            courses[i] = { ...courses[i], [k]: v };
            return { ...f, courses };
        });

    const deleteCourse = (i) =>
        setForm((f) => ({
            ...f,
            courses: f.courses.filter((_, idx) => idx !== i),
        }));

    const sgpa = calcSGPA(form.courses);
    const totalCredits = form.courses.reduce(
        (s, c) => s + Number(c.credits),
        0,
    );

    const inputCls = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg
    border border-dark-border text-slate-200 placeholder:text-slate-500
    focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave(form);
            }}
            className="space-y-5"
        >
            {/* Semester meta */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Semester *
                    </label>
                    <select
                        value={form.semester}
                        onChange={(e) =>
                            setField("semester", Number(e.target.value))
                        }
                        className={inputCls}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                                Semester {n}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Academic Year
                    </label>
                    <input
                        value={form.year}
                        onChange={(e) => setField("year", e.target.value)}
                        className={inputCls}
                        placeholder="2022-23"
                    />
                </div>
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Label
                    </label>
                    <input
                        value={form.label}
                        onChange={(e) => setField("label", e.target.value)}
                        className={inputCls}
                        placeholder="Odd Semester"
                    />
                </div>
            </div>

            {/* Courses */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label
                        className="text-[10px] text-slate-400 font-bold
            uppercase tracking-wider"
                    >
                        Courses ({form.courses.length})
                    </label>
                    <button
                        type="button"
                        onClick={addCourse}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              bg-accent-blue/10 text-accent-blue border border-accent-blue/20
              text-xs font-bold hover:bg-accent-blue/20 transition-all"
                    >
                        <Plus size={12} /> Add Course
                    </button>
                </div>

                {form.courses.length > 0 && (
                    <div className="bg-dark-bg border border-dark-border rounded-xl p-4">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            {[
                                "Code",
                                "Course Name",
                                "Credits",
                                "Grade",
                                "",
                            ].map((h, i) => (
                                <div
                                    key={i}
                                    className={`text-[9px] font-bold text-slate-500
                  uppercase tracking-wider
                  ${
                      i === 0
                          ? "col-span-2"
                          : i === 1
                            ? "col-span-5"
                            : i === 2
                              ? "col-span-2 text-center"
                              : i === 3
                                ? "col-span-2"
                                : "col-span-1"
                  }`}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                        {form.courses.map((c, i) => (
                            <CourseRow
                                key={i}
                                course={c}
                                index={i}
                                onChange={updateCourse}
                                onDelete={deleteCourse}
                            />
                        ))}
                    </div>
                )}

                {form.courses.length === 0 && (
                    <div
                        className="text-center py-8 border-2 border-dashed
            border-dark-border rounded-xl text-slate-600 text-sm"
                    >
                        No courses yet — click "Add Course" to start
                    </div>
                )}
            </div>

            {/* Live SGPA preview */}
            {form.courses.length > 0 && (
                <div
                    className="flex items-center gap-4 p-4 rounded-xl
          bg-accent-blue/5 border border-accent-blue/20"
                >
                    <div className="text-center">
                        <div className="text-2xl font-black grad-text">
                            {sgpa}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                            SGPA
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">
                            {totalCredits}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                            Credits
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">
                            {form.courses.length}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                            Courses
                        </div>
                    </div>
                    <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-accent-blue to-accent-purple rounded-full transition-all"
                            style={{ width: `${(Number(sgpa) / 10) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-dark-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-dark-border
            text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-grad-main text-white
            font-semibold text-sm hover:shadow-glow-blue
            transition-all disabled:opacity-60"
                >
                    {saving ? "Saving..." : "Save Semester"}
                </button>
            </div>
        </form>
    );
}

export default function SemesterManager() {
    const [semesters, setSemesters] = useState([]);
    const [cgpa, setCgpa] = useState(0);
    const [editing, setEditing] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await semesterAPI.getAllAdmin();
            setSemesters(res.data?.data || []);
            setCgpa(res.data?.cgpa || 0);
        } catch {
            toast.error("Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await semesterAPI.create(data);
                toast.success("Semester added!");
            } else {
                await semesterAPI.update(editing._id, data);
                toast.success("Updated!");
            }
            setEditing(null);
            await load();
        } catch {
            toast.error("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this semester and all its courses?")) return;
        try {
            await semesterAPI.delete(id);
            toast.success("Deleted");
            await load();
        } catch {
            toast.error("Error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Academic Semesters
                    </h2>
                    <p className="text-sm text-slate-500">
                        {semesters.length} semesters ·
                        <span className="text-accent-blue font-bold ml-1">
                            CGPA: {cgpa}
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-grad-main text-white text-sm font-semibold
            hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Semester
                </button>
            </div>

            {/* Form */}
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-dark-card border border-dark-border
              rounded-2xl p-6 mb-6 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-white">
                                {editing === "new"
                                    ? "Add New Semester"
                                    : `Edit Semester ${editing.semester}`}
                            </h3>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <SemesterForm
                            initial={editing === "new" ? EMPTY_SEM : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            saving={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CGPA summary */}
            {!loading && semesters.length > 0 && (
                <div
                    className="bg-dark-card border border-dark-border
          rounded-2xl p-4 mb-6 flex items-center gap-6"
                >
                    <div className="text-center">
                        <div className="text-3xl font-black grad-text">
                            {cgpa}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                            CGPA
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                        {[
                            { label: "Semesters", value: semesters.length },
                            {
                                label: "Courses",
                                value: semesters.flatMap((s) => s.courses)
                                    .length,
                            },
                            {
                                label: "Credits",
                                value: semesters
                                    .flatMap((s) => s.courses)
                                    .reduce((s, c) => s + c.credits, 0),
                            },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="text-center p-2 rounded-xl bg-dark-bg border border-dark-border"
                            >
                                <div className="text-lg font-bold text-white">
                                    {s.value}
                                </div>
                                <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="space-y-3">
                    {Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="skeleton h-20 rounded-2xl"
                            />
                        ))}
                </div>
            )}

            {/* Semester list */}
            {!loading && (
                <div className="space-y-3">
                    {semesters.map((sem) => {
                        const isOpen = expanded === sem._id;
                        return (
                            <motion.div
                                key={sem._id}
                                layout
                                className="bg-dark-card border border-dark-border
                  rounded-2xl overflow-hidden
                  hover:border-accent-blue/20 transition-all"
                            >
                                {/* Semester header row */}
                                <div className="flex items-center gap-4 p-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex-shrink-0
                    bg-gradient-to-br from-accent-blue to-accent-purple
                    flex items-center justify-center
                    text-white text-xs font-black"
                                    >
                                        S{sem.semester}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white text-sm">
                                                Semester {sem.semester}
                                            </span>
                                            {sem.label && (
                                                <span
                                                    className="text-[9px] px-2 py-0.5 rounded-full
                          bg-accent-blue/10 text-accent-blue
                          border border-accent-blue/20 font-bold"
                                                >
                                                    {sem.label}
                                                </span>
                                            )}
                                            {sem.year && (
                                                <span className="text-xs text-slate-500">
                                                    {sem.year}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span>
                                                {sem.courses.length} courses
                                            </span>
                                            <span>
                                                {sem.courses.reduce(
                                                    (s, c) => s + c.credits,
                                                    0,
                                                )}{" "}
                                                credits
                                            </span>
                                            <span className="text-accent-blue font-bold">
                                                SGPA: {sem.sgpa}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                setExpanded(
                                                    isOpen ? null : sem._id,
                                                )
                                            }
                                            className="w-8 h-8 rounded-lg text-slate-400
                        hover:text-white hover:bg-dark-bg
                        flex items-center justify-center transition-all"
                                        >
                                            {isOpen ? (
                                                <ChevronUp size={15} />
                                            ) : (
                                                <ChevronDown size={15} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setEditing(sem)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                        border border-dark-border text-slate-400
                        hover:text-accent-blue hover:border-accent-blue/30
                        text-xs font-medium transition-all"
                                        >
                                            <Edit2 size={12} /> Edit
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(sem._id)
                                            }
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                        border border-dark-border text-slate-400
                        hover:text-red-400 hover:border-red-400/30
                        text-xs font-medium transition-all"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable courses */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 border-t border-dark-border">
                                                <div className="overflow-x-auto mt-3">
                                                    <table className="w-full text-xs">
                                                        <thead>
                                                            <tr className="text-[9px] text-slate-500 uppercase tracking-wider">
                                                                <th className="text-left pb-2 font-bold">
                                                                    Code
                                                                </th>
                                                                <th className="text-left pb-2 font-bold">
                                                                    Name
                                                                </th>
                                                                <th className="text-center pb-2 font-bold">
                                                                    Credits
                                                                </th>
                                                                <th className="text-center pb-2 font-bold">
                                                                    Grade
                                                                </th>
                                                                <th className="text-right pb-2 font-bold">
                                                                    Points
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-dark-border/50">
                                                            {sem.courses.map(
                                                                (c, i) => (
                                                                    <tr key={i}>
                                                                        <td
                                                                            className="py-2 pr-3 font-mono font-bold
                                    text-accent-blue"
                                                                        >
                                                                            {
                                                                                c.code
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 pr-3 text-slate-300">
                                                                            {
                                                                                c.name
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center text-slate-400">
                                                                            {
                                                                                c.credits
                                                                            }
                                                                        </td>
                                                                        <td className="py-2 text-center">
                                                                            <span
                                                                                className="px-2 py-0.5 rounded-md
                                      bg-accent-blue/10 text-accent-blue
                                      font-bold border border-accent-blue/20"
                                                                            >
                                                                                {
                                                                                    c.grade
                                                                                }
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2 text-right text-slate-400">
                                                                            {c.credits *
                                                                                (GRADE_POINTS[
                                                                                    c
                                                                                        .grade
                                                                                ] ||
                                                                                    0)}
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {!loading && semesters.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                    <GraduationCap
                        size={40}
                        className="mx-auto mb-3 opacity-20"
                    />
                    <p className="text-sm">
                        No semesters yet — add Semester 1 to start!
                    </p>
                </div>
            )}
        </div>
    );
}
