import { createContext, useContext, useEffect } from "react";
import type { LearningCodeContext, LearningLessonContext } from "./learningTutorContext";
export const TutorOverlay = createContext<(context?:LearningCodeContext, anchor?:HTMLElement)=>void>(()=>{});
export const useFloatingTutor = ()=>useContext(TutorOverlay);
export const LessonHelpRegistration = createContext<(context?:LearningLessonContext)=>void>(()=>{});
export function useCurrentLessonHelp(context?:LearningLessonContext) {
  const register = useContext(LessonHelpRegistration);
  useEffect(() => { register(context);return () => register(undefined); }, [context,register]);
}
