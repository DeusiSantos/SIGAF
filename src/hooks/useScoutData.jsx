import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';


export const useAdministracoes = () => {
  const [administracoes, setAdministracoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchAdministracoes = async () => {
    try {
      const response = await api.get('/regional');
      setAdministracoes(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchAdministracoes();
}, []);

return { administracoes, loading, error };
};

export const useProvincia = () => {
  const [provincia, setProvincia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchProvincia = async () => {
    try {
      const response = await api.get('/provincia');
      setProvincia(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchProvincia();
}, []);

return { provincia, loading, error };
};


export const useGroupings = () => {
  const [groupings, setGroupings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupings = async () => {
      try {
        const response = await api.get('/agrupamento/all');
        setGroupings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGroupings();
  }, []);

  return { groupings, loading, error };
};

export const useNucleo = () => {
  const [nucleo, setNucleo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNucleo = async () => {
      try {
        const response = await api.get('/nucleo/all');
        setNucleo(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNucleo();
  }, []);

  return { nucleo, loading, error };
};



  export const useActivity = () => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await api.get('/atividadeRegional/all');
          setActivity(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, []);
  
    return { activity, loading, error };
  };

  export const useActivityAgrupamento = () => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await api.get('/atividadeDeAgrupamento/all');
          setActivity(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, []);
  
    return { activity, loading, error };
  };

  export const useActivityNacionais = () => {
    const [activityNacionais, setActivityNacionais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await api.get('/atividadesNacionais');
          setActivityNacionais(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, []);
  
    return { activityNacionais, loading, error };
  };


  export const useEventsNacionais = () => {
    const [eventsNacionais, setEventsNacionais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await api.get('/eventosNacionais');
          setEventsNacionais(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, []);
  
    return { eventsNacionais, loading, error };
  };

  export const useEventsRegionais = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await api.get('/eventos');
          setEvents(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, []);
  
    return { events, loading, error };
  };

  export const useEventsAgrupamento = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          const response = await api.get('/EventoAgrupamento');
          setEvents(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchCourse();
    }, []);
  
    return { events, loading, error };
  };

  export const useProfissionalNucleo = () => {
    const [profissionalNucleo, setProfissionalNucleo] = useState([]);
    const [loadingProfissionalNucleo, setLoadingProfissionalNucleo] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfissionalNucleo = async () => {
        try {
          const response = await api.get('/profissionaisNucleo');
          setProfissionalNucleo(response.data);
          setLoadingProfissionalNucleo(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchProfissionalNucleo();
    }, []);

    return { profissionalNucleo, loadingProfissionalNucleo, error };
  }

  export const useProfissionalRegional = () => {
    const [profissionalNucleo, setProfissionalNucleo] = useState([]);
    const [loadingProfissionalNucleo, setLoadingProfissionalNucleo] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfissionalNucleo = async () => {
        try {
          const response = await api.get('/profissionaisRegional');
          setProfissionalNucleo(response.data);
          setLoadingProfissionalNucleo(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchProfissionalNucleo();
    }, []);

    return { profissionalNucleo, loadingProfissionalNucleo, error };
  }

  export const useProfissionalNacional = () => {
    const [profissionalNucleo, setProfissionalNucleo] = useState([]);
    const [loadingProfissionalNucleo, setLoadingProfissionalNucleo] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfissionalNucleo = async () => {
        try {
          const response = await api.get('/profissionaisNacional');
          setProfissionalNucleo(response.data);
          setLoadingProfissionalNucleo(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchProfissionalNucleo();
    }, []);

    return { profissionalNucleo, loadingProfissionalNucleo, error };
  }

 // Primeiro vamos atualizar o hook useProgressao para incluir a função de atualização
 export const useProgressao = () => {
  const [progressao, setProgressao] = useState([]);
  const [loadingProgressao, setLoadingProgressao] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgressao = async () => {
      try {
          const response = await api.get('/progressoDoEscuteiro/all');
          setProgressao(response.data);
          setLoadingProgressao(false);
      } catch (err) {
          setError(err.message);
          setLoadingProgressao(false);
      }
  };

  useEffect(() => {
      fetchProgressao();
  }, []);

  return { 
      progressao, 
      loadingProgressao, 
      error,
      recarregarProgressao: fetchProgressao 
  };
};
  export const useEtapas = () => {
    const [etapas, setEtapas] = useState([]);
    const [loadingEtapas, setLoadingEtapas] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchEtapas = async () => {
        try {
          const response = await api.get('/estagioDoProgresso/all');
          setEtapas(response.data);
          setLoadingEtapas(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchEtapas();
    }, []);

    return { etapas, loadingEtapas, error };
  }



  export const useScout = () => {
    const [scout, setScout] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchScouts = async () => {
        try {
          const response = await api.get('/escuteiro/all');
          setScout(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchScouts();
    }, []);

   
  
    const mutate = useCallback(async (newData = null, revalidate = true) => {
      if (newData !== null) {
        // If new data is provided, update the state immediately (optimistic update)
        setScout(newData);
      }
  
      if (revalidate) {
        // Revalidate data from the server
        try {
          const response = await api.get('/escuteiro/all');
          setScout(response.data);
        } catch (err) {
          setError(err.message);
        }
      }
    }, []);
  
    return { scout, loading, error, mutate };
};

export const useGestores = () => {
  const [gestores, setGestores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgrupamentos = async () => {
      try {
        const response = await api.get('/gestor');
        setGestores(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAgrupamentos();
  }, []);

  return { gestores, loading, error };
};


export const useNumTotalEscuteiros = () => {
  const [numTotalEscuteiros, setNumTotalEscuteiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiros = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiros');
        setNumTotalEscuteiros(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiros();
  }, []);

  return { numTotalEscuteiros, loading, error };
}

export const useNumTotalEscuteiroAtivos = () => {
  const [numTotalEscuteiroAtivos, setNumTotalEscuteiroAtivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroAtivos = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiro-ativos');
        setNumTotalEscuteiroAtivos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroAtivos();
  }, []);

  return { numTotalEscuteiroAtivos, loading, error };
};

export const useNumTotalEscuteiroInativos = () => {
  const [numTotalEscuteiroInativos, setNumTotalEscuteiroInativos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroInativos = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiros-inativos');
        setNumTotalEscuteiroInativos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroInativos();
  }, []);

  return { numTotalEscuteiroInativos, loading, error };
};

export const useNumTotalEscuteiroLobitos = () => {
  const [numTotalEscuteiroLobitos, setNumTotalEscuteiroLobitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroInativos = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiro-lobitos');
        setNumTotalEscuteiroLobitos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroInativos();
  }, []);

  return { numTotalEscuteiroLobitos, loading, error };
};

export const useNumTotalEscuteiroJuniors = () => {
  const [numTotalEscuteiroJuniors, setNumTotalEscuteiroJuniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroJuniors = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiro-juniores');
        setNumTotalEscuteiroJuniors(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroJuniors();
  }, []);

  return { numTotalEscuteiroJuniors, loading, error };
};

export const useNumTotalEscuteiroSeniors = () => {
  const [numTotalEscuteiroSeniors, setNumTotalEscuteiroSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroSeniors = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiro-seniores');
        setNumTotalEscuteiroSeniors(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroSeniors();
  }, []);

  return { numTotalEscuteiroSeniors, loading, error };
};

export const useNumTotalEscuteiroCaminheiros = () => {
  const [numTotalEscuteiroCaminheiros, setNumTotalEscuteiroCaminheiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroCaminheiros = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiro-caminheiros');
        setNumTotalEscuteiroCaminheiros(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroCaminheiros();
  }, []);

  return { numTotalEscuteiroCaminheiros, loading, error };
};

export const useNumTotalEscuteiroDirigentes = () => {
  const [numTotalEscuteiroDirigentes, setNumTotalEscuteiroDirigentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteiroDirigentes = async () => {
      try {
        const response = await api.get('/escuteiro/total-de-escuteiro-dirigentes');
        setNumTotalEscuteiroDirigentes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteiroDirigentes();
  }, []);

  return { numTotalEscuteiroDirigentes, loading, error };
};

export const useNumTotalEscuteirosAgrupamentos = () => {
  const [numTotalEscuteirosAgrupamentos, setNumTotalEscuteirosAgrupamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumTotalEscuteirosAgrupamentos = async () => {
      try {
        const response = await api.get('/regional/stats');
        setNumTotalEscuteirosAgrupamentos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNumTotalEscuteirosAgrupamentos();
  }, []);

  return { numTotalEscuteirosAgrupamentos, loading, error };
};

export const useNumTodosOsDirigentes = () => {
  const [TodosOsDirigentes, setTodosOsDirigentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodosOsDirigentes = async () => {
      try {
        const response = await api.get('/escuteiro/listar-dirigentes');
        setTodosOsDirigentes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTodosOsDirigentes();
  }, []);

  return { TodosOsDirigentes, loading, error };
};
