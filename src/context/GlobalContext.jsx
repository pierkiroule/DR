import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef
} from "react";
import { ref, set, onValue, remove } from "firebase/database";
import { db } from "../firebase";
import { newBubble, pastelColor } from "../utils/mapHelpers";

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  // --- États globaux ---
  const [pseudo, setPseudo] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sessionCode, setSessionCode] = useState("");
  const [sessionMeta, setSessionMeta] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [linkEditMode, setLinkEditMode] = useState(false);
  const [designSets, setDesignSets] = useState([]);
  const [assignationTarget, setAssignationTarget] = useState(null);
  const [assignationMode, setAssignationMode] = useState(false);
const [assignationSelection, setAssignationSelection] = useState([]);
const [resources, setResources] = useState([]);
const [selectedResources, setSelectedResources] = useState([]);

const updateResource = async (arId, data) => {
  if (!arId) return;
  try {
    await set(ref(db, `arlibrary/${arId}`), { ...data });
    // Le onValue Firebase synchronisera automatiquement le state local
    console.log("✅ AR mis à jour dans Firebase :", arId, data);
  } catch (e) {
    console.error("❌ Erreur updateResource :", e);
  }
};

const toggleResourceInSet = (resource) => {
  setSelectedResources((prev) =>
    prev.some((r) => r.id === resource.id)
      ? prev.filter((r) => r.id !== resource.id)
      : [...prev, resource]
  );
};

const deleteResource = async (arId) => {
  if (!arId) return;
  try {
    await remove(ref(db, `arlibrary/${arId}`));
    setResources(prev => prev.filter(r => r.id !== arId));
    console.log("🗑 AR supprimé :", arId);
  } catch (e) {
    console.error("❌ Erreur suppression AR :", e);
  }
};

const [groups, setGroups] = useState([]);


  

// Helper pour récupérer la valeur une seule fois (promise)
// Helper pour lire une seule fois la valeur d'une référence Firebase (Promise)
function onValueOnce(ref, cb) {
  return new Promise((resolve) =>
    onValue(ref, (snap) => {
      cb(snap);
      resolve();
    }, { onlyOnce: true })
  );
}

// Ajouter un groupe (sécurisé, pas d’écrasement)
const addGroup = async (groupObj) => {
  if (!sessionCode) return;
  const groupsRef = ref(db, `sessions/${sessionCode}/groups`);
  await onValueOnce(groupsRef, (snap) => {
    const firebaseGroups = snap.val() || [];
    const updated = [...firebaseGroups, groupObj];
    set(groupsRef, updated);
  });
};

// Synchronisation live des groupes depuis Firebase
useEffect(() => {
  if (!sessionCode) return;
  const groupsRef = ref(db, `sessions/${sessionCode}/groups`);
  const unsub = onValue(groupsRef, (snap) => {
    setGroups(snap.val() || []);
  });
  return () => unsub();
}, [sessionCode]);

// Ajouter un membre à un groupe
const addMemberToGroup = async (groupIdx, member) => {
  if (!sessionCode) return;
  const groupsRef = ref(db, `sessions/${sessionCode}/groups`);
  await onValueOnce(groupsRef, (snap) => {
    const firebaseGroups = snap.val() || [];
    const updated = firebaseGroups.map((g, i) =>
      i === groupIdx ? { ...g, members: [...(g.members || []), member] } : g
    );
    set(groupsRef, updated);
  });
};

// Supprimer un groupe
const removeGroup = async (groupIdx) => {
  if (!sessionCode) return;
  const groupsRef = ref(db, `sessions/${sessionCode}/groups`);
  await onValueOnce(groupsRef, (snap) => {
    const firebaseGroups = snap.val() || [];
    const updated = firebaseGroups.filter((_, i) => i !== groupIdx);
    set(groupsRef, updated);
  });
};

// Supprimer un membre d’un groupe
const removeMemberFromGroup = async (groupIdx, memberIdx) => {
  if (!sessionCode) return;
  const groupsRef = ref(db, `sessions/${sessionCode}/groups`);
  await onValueOnce(groupsRef, (snap) => {
    const firebaseGroups = snap.val() || [];
    const updated = firebaseGroups.map((g, i) =>
      i === groupIdx
        ? { ...g, members: (g.members || []).filter((_, j) => j !== memberIdx) }
        : g
    );
    set(groupsRef, updated);
  });
};

const [pads, setPads] = useState(Array(8).fill(null)); // 8 pads vides

// Charger depuis Firebase
useEffect(() => {
  if (!sessionCode) return;
  const padsRef = ref(db, `sessions/${sessionCode}/pads`);
  const unsub = onValue(padsRef, snap => {
    let data = snap.val() || [];
    if (!Array.isArray(data)) data = [];
    // Toujours 8 éléments
    if (data.length < 8) data = [...data, ...Array(8 - data.length).fill(null)];
    if (data.length > 8) data = data.slice(0, 8);
    setPads(data);
  });
  return () => unsub();
}, [sessionCode]);

// MAJ un pad
const assignPad = async (idx, ar) => {
  let updated = pads.slice(); // Copie du tableau
  if (updated.length < 8) updated = [...updated, ...Array(8 - updated.length).fill(null)];
  if (updated.length > 8) updated = updated.slice(0, 8);
  updated[idx] = ar;
  await set(ref(db, `sessions/${sessionCode}/pads`), updated);
};

// Supprimer un pad
const clearPad = async (idx) => {
  const updated = pads.map((p, i) => (i === idx ? null : p));
  await set(ref(db, `sessions/${sessionCode}/pads`), updated);
};

  // --- Références Firebase ---
  const bubblesRef = useRef(null);
  const linksRef = useRef(null);
  const metaRef = useRef(null);
  const participantsRef = useRef(null);

  // --- Assignation Modal ---
  const openAssignationModal = (id, type) => {
  setAssignationTarget({ id, type });
  setAssignationMode(true);
  setAssignationSelection([id]);
};
  const closeAssignationModal = () => setAssignationTarget(null);
  
  // --- Chargement resources ARLibrary ---
useEffect(() => {
  const arRef = ref(db, "arlibrary");
  const unsub = onValue(arRef, (snapshot) => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
    setResources(list.reverse());
  });
  return () => unsub();
}, []);

  // --- Setup Firebase Refs ---
  useEffect(() => {
    if (!sessionCode) return;
    bubblesRef.current = ref(db, `sessions/${sessionCode}/bubbles`);
    linksRef.current = ref(db, `sessions/${sessionCode}/links`);
    metaRef.current = ref(db, `sessions/${sessionCode}/meta`);
    participantsRef.current = ref(db, `sessions/${sessionCode}/participants`);
  }, [sessionCode]);

  // --- Sync Firebase ---
  const syncFirebase = useCallback(async (newBubbles, newLinks) => {
    if (!sessionCode) return;
    try {
      setSyncStatus("syncing");
      await set(bubblesRef.current, newBubbles);
      await set(linksRef.current, newLinks);
      setBubbles(newBubbles);
      setLinks(newLinks);
      setSyncStatus("idle");
    } catch (e) {
      console.error("Erreur syncFirebase :", e);
      setSyncStatus("error");
    }
  }, [sessionCode]);

  // --- Initialisation d'une bulle si vide ---
  useEffect(() => {
    if (!sessionCode || bubbles.length !== 0) return;
    const initialId = "b" + Date.now();
    const initial = { id: initialId, lat: 48.85, lng: 2.35, r: 300, color: "#2288ee" };
    setBubbles([initial]);
    setLinks([]);
    set(ref(db, `sessions/${sessionCode}/bubbles`), [initial]);
    set(ref(db, `sessions/${sessionCode}/links`), []);
  }, [sessionCode, bubbles.length]);

  // --- Écoute Firebase Live ---
  useEffect(() => {
    if (!sessionCode || isDragging) return;

    const unsubB = onValue(bubblesRef.current, snap => setBubbles(snap.val() || []));
    const unsubL = onValue(linksRef.current, snap => setLinks(snap.val() || []));
    const unsubM = onValue(metaRef.current, snap => setSessionMeta(snap.val() || null));
    const unsubP = onValue(participantsRef.current, snap => setParticipants(snap.val() || []));



    return () => {
      unsubB(); unsubL(); unsubM(); unsubP();
    };
  }, [sessionCode, isDragging]);

  // --- Manipulations des bulles ---
  const updateBubble = useCallback((id, partial) => {
    const updated = bubbles.map(b => b.id === id ? { ...b, ...partial } : b);
    syncFirebase(updated, links);
  }, [bubbles, links, syncFirebase]);

  const resizeSelected = useCallback((delta) => {
    const updated = bubbles.map(b =>
      selectedIds.includes(b.id)
        ? { ...b, r: Math.max(5, (b.r || 30) + delta) }
        : b
    );
    syncFirebase(updated, links);
  }, [bubbles, links, selectedIds, syncFirebase]);

  const deleteSelected = () => {
    const remaining = bubbles.filter(b => !selectedIds.includes(b.id));
    const updatedLinks = links.filter(l =>
      !selectedIds.includes(l.from) && !selectedIds.includes(l.to)
    );
    syncFirebase(remaining, updatedLinks);
    setSelectedIds([]);
  };

  const duplicateSelected = () => {
    const duplicated = selectedIds.map(id => {
      const b = bubbles.find(b => b.id === id);
      if (!b) return null;
      const newId = "b" + Date.now() + Math.random().toString(36).slice(2, 5);
      return { ...b, id: newId, lat: b.lat + 0.0005, lng: b.lng + 0.0005 };
    }).filter(Boolean);
    syncFirebase([...bubbles, ...duplicated], links);
  };

  const colorizeSelected = () => {
    const updated = bubbles.map(b =>
      selectedIds.includes(b.id)
        ? { ...b, color: pastelColor() }
        : b
    );
    syncFirebase(updated, links);
  };

  // --- Manipulation des liens ---
  const createLinkBetweenSelected = () => {
    if (selectedIds.length !== 2) return;
    const [a, b] = selectedIds;

    const exists = links.some(l =>
      (l.from === a && l.to === b) || (l.from === b && l.to === a)
    );
    if (!exists) {
      const newL = {
        id: "l" + Date.now(),
        from: a,
        to: b,
        thickness: 10,
        color: pastelColor()
      };
      syncFirebase(bubbles, [...links, newL]);
    }
  };

  const increaseLinkThickness = () => {
    const updated = links.map(l =>
      selectedIds.includes(l.from) || selectedIds.includes(l.to)
        ? { ...l, thickness: (l.thickness || 10) + 2 }
        : l
    );
    syncFirebase(bubbles, updated);
  };

  const decreaseLinkThickness = () => {
    const updated = links.map(l =>
      selectedIds.includes(l.from) || selectedIds.includes(l.to)
        ? { ...l, thickness: Math.max(2, (l.thickness || 10) - 2) }
        : l
    );
    syncFirebase(bubbles, updated);
  };
  
  const saveDesignSetToFirebase = async (setData) => {
  try {
    const id = "ds_" + Date.now();
    await set(ref(db, `designsets/${id}`), {
      ...setData,
      id,
      createdAt: Date.now(),
    });
    console.log("✅ DesignSet enregistré :", id);
  } catch (e) {
    console.error("❌ Erreur lors de l'enregistrement du DesignSet :", e);
  }
};
  
  // --- Valide l'assignation des éléments sélectionnés (bulles ou liens) à un AR ---
// arId : identifiant du DesignSet (acteur-réseau)
// Cette fonction enregistre l'assignation dans Firebase, puis réinitialise l'état local

const validerAssignation = async (arId) => {
  if (!sessionCode || assignationSelection.length === 0) return;

  try {
    const path = `sessions/${sessionCode}/assignations/${arId}`;
    const payload = assignationSelection.reduce((acc, eltId) => {
      acc[eltId] = true;
      return acc;
    }, {});

    await set(ref(db, path), payload);
    console.log(`✅ Assignation enregistrée pour ${arId}`, payload);
    
    // Reset
    setAssignationSelection([]);
    setAssignationMode(false);

  } catch (e) {
    console.error("❌ Erreur assignation :", e);
  }
};

  // --- Chargement DesignSets ---
  useEffect(() => {
    const dsRef = ref(db, "designsets");
    const unsub = onValue(dsRef, snap => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setDesignSets(list);
    });
    return () => unsub();
  }, []);

  // --- Export ---
  return (
    <GlobalContext.Provider value={{
      pseudo, setPseudo,
      bubbles, links, selectedIds, setSelectedIds,
      sessionCode, setSessionCode,
      sessionMeta, participants,
      syncStatus, isDragging, setIsDragging,
      linkEditMode, setLinkEditMode,
      designSets, setDesignSets,
      saveDesignSetToFirebase,
      assignationTarget, openAssignationModal, closeAssignationModal,
      assignationMode, setAssignationMode, resources, selectedResources,
setSelectedResources,
updateResource,
deleteResource,
toggleResourceInSet,
assignationSelection, setAssignationSelection,
validerAssignation,
syncFirebase,
groups, setGroups,
  addGroup, addMemberToGroup, removeGroup, removeMemberFromGroup, pads, assignPad, clearPad,
  // ...
  // ...

      addBubble: (lat, lng) => {
        const id = "b" + Date.now();
        const b = newBubble(id, lat, lng);
        syncFirebase([...bubbles, b], links);
      },
      updateBubble,
      resizeSelected,
      deleteSelected,
      duplicateSelected,
      colorizeSelected,
      createLinkBetweenSelected,
      increaseLinkThickness,
      decreaseLinkThickness
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => useContext(GlobalContext);