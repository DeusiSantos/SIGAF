import {
  AlertCircle,
  CheckCircle,
  File,
  FileText,
  Image,
  Loader,
  Upload,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";

/**
 * Componente de Upload de Arquivos Reutilizável
 *
 * @param {Object} props - Propriedades do componente
 * @param {string} props.label - Label do campo de upload
 * @param {Function} props.onChange - Callback quando arquivo é selecionado (file)
 * @param {string} props.accept - Tipos de arquivo aceitos (ex: ".pdf,.doc,.docx")
 * @param {number} props.maxSize - Tamanho máximo em MB (padrão: 10MB)
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {string} props.errorMessage - Mensagem de erro a ser exibida
 * @param {string} props.helperText - Texto de ajuda
 * @param {string} props.placeholder - Texto do placeholder
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {boolean} props.multiple - Permitir múltiplos arquivos
 * @param {Object} props.icon - Ícone customizado (componente Lucide)
 * @param {string} props.variant - Estilo do componente: 'default' | 'compact' | 'dropzone'
 * @param {string} props.color - Cor do tema: 'blue' | 'green' | 'purple' | 'orange'
 * @param {File|null} props.value - Arquivo atual (para controle externo)
 * @param {boolean} props.showPreview - Mostrar preview de imagens
 * @param {string} props.className - Classes CSS adicionais
 */
const FileUpload = ({
  label,
  onChange,
  accept = "*",
  maxSize = 10, // MB
  required = false,
  errorMessage,
  helperText,
  placeholder = "Clique ou arraste um arquivo",
  disabled = false,
  multiple = false,
  icon: CustomIcon,
  variant = "default", // 'default' | 'compact' | 'dropzone'
  color = "blue", // 'blue' | 'green' | 'purple' | 'orange'
  value,
  showPreview = true,
  className = "",
}) => {
  const [uploadedFile, setUploadedFile] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(errorMessage || "");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Cores do tema
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      bgHover: "hover:bg-blue-100",
      border: "border-blue-300",
      borderHover: "hover:border-blue-400",
      text: "text-blue-600",
      icon: "text-blue-500",
    },
    green: {
      bg: "bg-green-50",
      bgHover: "hover:bg-green-100",
      border: "border-green-300",
      borderHover: "hover:border-green-400",
      text: "text-green-600",
      icon: "text-green-500",
    },
    purple: {
      bg: "bg-purple-50",
      bgHover: "hover:bg-purple-100",
      border: "border-purple-300",
      borderHover: "hover:border-purple-400",
      text: "text-purple-600",
      icon: "text-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      bgHover: "hover:bg-orange-100",
      border: "border-orange-300",
      borderHover: "hover:border-orange-400",
      text: "text-orange-600",
      icon: "text-orange-500",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  // Validar arquivo
  const validateFile = (file) => {
    // Verificar tamanho
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return false;
    }

    // Verificar tipo
    if (accept !== "*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();
      const fileType = file.type;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        return fileType.match(type.replace("*", ".*"));
      });

      if (!isAccepted) {
        setError(`Tipo de arquivo não aceito. Aceitos: ${accept}`);
        return false;
      }
    }

    setError("");
    return true;
  };

  // Gerar preview para imagens
  const generatePreview = (file) => {
    if (file && file.type.startsWith("image/") && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Manipular seleção de arquivo
  const handleFileSelect = (file) => {
    if (!file) return;

    if (validateFile(file)) {
      setUploadedFile(file);
      generatePreview(file);

      // Simular upload (remover em produção)
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        if (onChange) {
          onChange(file);
        }
      }, 500);
    }
  };

  // Manipular mudança do input
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Manipular drag & drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Remover arquivo
  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
    }
  };

  // Abrir seletor de arquivo
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Obter ícone do arquivo
  const getFileIcon = () => {
    if (CustomIcon) {
      return (
        <CustomIcon
          className={`w-8 h-8 ${uploadedFile ? colors.icon : "text-gray-400"}`}
        />
      );
    }

    if (uploadedFile) {
      if (uploadedFile.type.startsWith("image/")) {
        return <Image className={`w-8 h-8 ${colors.icon}`} />;
      }
      if (uploadedFile.type.includes("pdf")) {
        return <FileText className={`w-8 h-8 ${colors.icon}`} />;
      }
      return <File className={`w-8 h-8 ${colors.icon}`} />;
    }

    return <Upload className="w-8 h-8 text-gray-400" />;
  };

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Renderizar variante compact
  if (variant === "compact") {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
            multiple={multiple}
          />

          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : `${colors.bg} ${colors.text} ${colors.border} ${colors.bgHover}`
            }`}
          >
            <Upload size={16} />
            Escolher arquivo
          </button>

          {uploadedFile && (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm text-gray-600 truncate flex-1">
                {uploadedFile.name}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Renderizar variante default/dropzone
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          multiple={multiple}
        />

        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            disabled
              ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
              : isDragging
              ? `${colors.bg} ${colors.border} scale-105`
              : uploadedFile
              ? `${colors.bg} ${colors.border} ${colors.bgHover}`
              : `bg-gray-50 border-gray-300 ${colors.borderHover} ${colors.bgHover}`
          }`}
        >
          {/* Loading State */}
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
              <Loader className={`w-8 h-8 animate-spin ${colors.text}`} />
            </div>
          )}

          {/* Preview de Imagem */}
          {preview && showPreview && (
            <div className="absolute inset-0 p-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* Conteúdo do Upload */}
          {!preview && (
            <>
              {getFileIcon()}

              <p
                className={`text-sm font-medium mt-3 ${
                  uploadedFile ? colors.text : "text-gray-500"
                }`}
              >
                {uploadedFile ? uploadedFile.name : placeholder}
              </p>

              {uploadedFile && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(uploadedFile.size)}
                </p>
              )}

              {!uploadedFile && (
                <p className="text-xs text-gray-400 mt-2">
                  ou arraste o arquivo aqui
                </p>
              )}

              {uploadedFile && (
                <div className="flex items-center gap-2 mt-3">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    Arquivo carregado
                  </span>
                </div>
              )}
            </>
          )}

          {/* Botão Remover */}
          {uploadedFile && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Helper Text / Error */}
      {helperText && !error && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {helperText}
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
