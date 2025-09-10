import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';


export const useProdutores = () => {
  const [produtor, setProdutor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/dashboard/exceptoAprovados');
        setProdutor(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtor, loading, error };
};

export const useProdutoresFlorestais  = () => {
  const [produtorFlorestais, setProdutorFlorestais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/produtorFlorestal/all');
        setProdutorFlorestais(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtorFlorestais, loading, error };
};

export const useProdutoresAprovados = () => {
  const [produtor, setProdutor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/dashboard/aprovados');
        setProdutor(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtor, loading, error };
};

export const useNumAprovados = () => {
  const [produtorNumAprovado, setProdutorNumAprovado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/formulario/all');
        setProdutorNumAprovado(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtorNumAprovado, loading, error };
};

export const useNumTotalProdutores = () => {
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/formulario/all');
        setTotal(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { total, loading, error };
};

export const useNumFemenino = () => {
  const [femenino, setFemenino] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/formulario/all');
        setFemenino(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { femenino, loading, error };
};

export const useCertificados = () => {
  const [certificado, setCertificado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCerificado = async () => {
      try {
        const response = await api.get('/certificaoDoProdutor/produtoresComCertificados');
        setCertificado(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCerificado();
  }, []);

return { certificado, loading, error };
};

export const useProjetos = () => {
  const [projeto, setProjeto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchProjeto = async () => {
    try {
      const response = await api.get('/projetoBeneficiario/all');
      setProjeto(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchProjeto();
}, []);

return { projeto, loading, error };
};

export const useTotalPecuaria = () => {
  const [pecuaria, setPecuaria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCerificado = async () => {
      try {
        const response = await api.get('/dashboard/totalPecuaria');
        setPecuaria(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCerificado();
  }, []);

  return { pecuaria, loading, error };
};

export const useTotalAgricultura = () => {
  const [agriciltura, setAgriciltura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCerificado = async () => {
      try {
        const response = await api.get('/dashboard/totalPecuaria');
        setAgriciltura(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCerificado();
  }, []);

  return { agriciltura, loading, error };
};

export const useTotalProdutorFlorestal = () => {
  const [produtorFlorestal, setProdutorFlorestal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCerificado = async () => {
      try {
        const response = await api.get('/dashboard/totalPecuaria');
        setProdutorFlorestal(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCerificado();
  }, []);

  return { produtorFlorestal, loading, error };
};