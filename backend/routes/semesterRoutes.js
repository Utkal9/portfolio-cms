import express from "express";
import { Semester } from "../models/index.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// Grade → grade points mapping
const GRADE_POINTS = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
    F: 0,
    IP: null,
};

function calcSGPA(courses) {
    // Only include courses with a real grade
    const gradedCourses = courses.filter(
        (c) => c.grade !== "IP" && GRADE_POINTS[c.grade] !== null,
    );
    const totalCredits = gradedCourses.reduce(
        (s, c) => s + Number(c.credits),
        0,
    );
    const totalPoints = gradedCourses.reduce(
        (s, c) => s + Number(c.credits) * (GRADE_POINTS[c.grade] || 0),
        0,
    );
    return totalCredits > 0 ? +(totalPoints / totalCredits).toFixed(2) : 0;
}

// Public — get all visible semesters with calculated SGPA
router.get("/", async (req, res) => {
    try {
        const semesters = await Semester.find({ visible: true }).sort({
            semester: 1,
        });

        const data = semesters.map((sem) => {
            const sgpa = calcSGPA(sem.courses);
            return { ...sem.toObject(), sgpa };
        });

        // Calculate CGPA
        const allCourses = data.flatMap((s) => s.courses);
        const cgpa = calcSGPA(allCourses);

        res.json({ success: true, data, cgpa });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin — get all
router.get("/all", auth, async (req, res) => {
    try {
        const semesters = await Semester.find().sort({ semester: 1 });
        const data = semesters.map((sem) => ({
            ...sem.toObject(),
            sgpa: calcSGPA(sem.courses),
        }));
        const allCourses = data.flatMap((s) => s.courses);
        const cgpa = calcSGPA(allCourses);
        res.json({ success: true, data, cgpa });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Admin — create semester
router.post("/", auth, async (req, res) => {
    try {
        const sem = await Semester.create(req.body);
        res.status(201).json({ success: true, data: sem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Admin — update semester
router.put("/:id", auth, async (req, res) => {
    try {
        const sem = await Semester.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json({ success: true, data: sem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Admin — delete semester
router.delete("/:id", auth, async (req, res) => {
    try {
        await Semester.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
