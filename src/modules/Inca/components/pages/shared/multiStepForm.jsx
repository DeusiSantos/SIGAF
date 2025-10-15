import { Check, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useState } from "react";

const MultiStepForm = ({
  steps = [],
  onSubmit,
  onStepChange,
  validateStep,
  formData = {},
  loading = false,
  submitButtonText = "Finalizar",
  title = "Formulário Multi-Etapas",
  subtitle = "Preencha as informações em cada etapa",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = async () => {
    if (validateStep) {
      const isValid = await validateStep(activeIndex, formData);
      if (!isValid) return;
    }

    if (activeIndex < steps.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      if (onStepChange) onStepChange(newIndex);
    }
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      if (onStepChange) onStepChange(newIndex);
    }
  };

  const handleStepClick = (index) => {
    if (index <= activeIndex) {
      setActiveIndex(index);
      if (onStepChange) onStepChange(index);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep) {
      const isValid = await validateStep(activeIndex, formData);
      if (!isValid) return;
    }
    if (onSubmit) await onSubmit(e);
  };

  const isLastStep = activeIndex === steps.length - 1;
  const progressPercentage = ((activeIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen">
      <div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-2xl">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                    index > activeIndex ? "opacity-50" : ""
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <div
                    className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                      index < activeIndex
                        ? "bg-amber-800 text-white"
                        : index === activeIndex
                        ? "bg-amber-400 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span
                    className={`text-sm text-center font-medium ${
                      index === activeIndex
                        ? "text-amber-700"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div
            className="w-full bg-gray-200 h-2 mb-8 mx-8"
            style={{ width: "calc(100% - 4rem)" }}
          >
            <div
              className="bg-amber-800 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Step Content */}
          <div className="step-content p-8 bg-white min-h-[600px]">
            {steps[activeIndex]?.content}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
            <button
              type="button"
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
                activeIndex === 0
                  ? "opacity-50 cursor-not-allowed bg-gray-100"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400"
              }`}
              onClick={handlePrevious}
              disabled={activeIndex === 0}
            >
              <ChevronLeft size={20} className="mr-2" />
              Anterior
            </button>

            <div className="text-sm text-gray-500 font-medium">
              Etapa {activeIndex + 1} de {steps.length}
            </div>

            <button
              type="button"
              className="px-8 py-3 rounded-xl flex items-center transition-all font-medium bg-amber-800 hover:bg-amber-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              onClick={(e) => (isLastStep ? handleSubmit(e) : handleNext())}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Processando...
                </>
              ) : isLastStep ? (
                <>
                  <Check size={20} className="mr-2" />
                  {submitButtonText}
                </>
              ) : (
                <>
                  <span className="mr-2">Próximo</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
