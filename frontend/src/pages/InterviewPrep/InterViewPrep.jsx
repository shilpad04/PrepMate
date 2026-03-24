import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import AIResponsePreview from "./components/AIResponsePreview";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      const data = response.data;

      if (data?.title && data?.explanation) {
        setExplanation({
          title: data.title,
          explanation: data.explanation,
          answerTips: data.answerTips || [],
          quickNotes: data.quickNotes || [],
        });
      } else if (data?.raw) {
        try {
          const parsed = JSON.parse(data.raw);
          setExplanation({
            title: parsed.title || "AI Response",
            explanation: parsed.explanation || data.raw,
            answerTips: parsed.answerTips || [],
            quickNotes: parsed.quickNotes || [],
          });
        } catch {
          setExplanation({
            title: "AI Response",
            explanation: data.raw,
            answerTips: [],
            quickNotes: [],
          });
        }
      } else {
        setErrorMsg("Unexpected response format. Try again.");
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Try again later.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );
      if (response.data && response.data.question) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      setErrorMsg("");

      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      const aiData = aiResponse.data;
      let generatedQuestions = null;

      if (Array.isArray(aiData)) {
        generatedQuestions = aiData;
      } else if (aiData?.raw) {
        try {
          const parsed = JSON.parse(aiData.raw);
          if (Array.isArray(parsed)) generatedQuestions = parsed;
        } catch {
          setErrorMsg("AI returned invalid data. Please try again.");
          return;
        }
      } else {
        setErrorMsg("AI returned unexpected format. Please try again.");
        return;
      }

      if (!generatedQuestions || generatedQuestions.length === 0) {
        setErrorMsg("No questions were generated. Please try again.");
        return;
      }

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        { sessionId, questions: generatedQuestions }
      );

      if (response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
  }, []);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="max-w-6xl mx-auto px-6 pt-4 pb-10">
        <h2 className="text-lg font-semibold text-black mb-5">Interview Q&A</h2>

        <div className="max-w-3xl">
          <AnimatePresence>
            {sessionData?.questions?.map((data, index) => (
              <motion.div
                key={data._id || index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.1,
                  damping: 15,
                }}
              >
                <QuestionCard
                  question={data?.question}
                  answer={data?.answer}
                  onLearnMore={() => generateConceptExplanation(data.question)}
                  isPinned={data?.isPinned}
                  onTogglePin={() => toggleQuestionPinStatus(data._id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {sessionData?.questions?.length > 0 && (
            <div className="flex justify-center mt-4 mb-8">
              <button
                className="flex items-center gap-2 text-xs text-indigo-800 font-medium bg-indigo-50 px-5 py-2.5 rounded-lg border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdateLoader}
                onClick={uploadMoreQuestions}
              >
                {isUpdateLoader ? (
                  <SpinnerLoader />
                ) : (
                  <LuListCollapse className="text-sm" />
                )}
                {isUpdateLoader ? "Generating..." : "Load More Questions"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Drawer
        isOpen={openLearnMoreDrawer}
        onClose={() => {
          setOpenLearnMoreDrawer(false);
          setExplanation(null);
          setErrorMsg("");
        }}
        title={!isLoading ? explanation?.title || "AI Explanation" : "Loading..."}
        answerTips={explanation?.answerTips || []}
        quickNotes={explanation?.quickNotes || []}
      >
        {errorMsg && (
          <p className="flex gap-2 text-sm text-amber-600 font-medium">
            <LuCircleAlert className="mt-1" /> {errorMsg}
          </p>
        )}

        {isLoading && <SkeletonLoader />}

        {!isLoading && explanation && (
          <AIResponsePreview content={explanation.explanation} />
        )}
      </Drawer>
    </DashboardLayout>
  );
};

export default InterviewPrep;