import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const SubcategoryContext = createContext({
    subcategories: [],
    selectedSubcategories: [],
    isLoadingSubcategories: false,
    isAddSubcategoryModalVisible: false,
    toggleSubcategorySelection: (subcategoryId) => { },
    fetchSubcategoriesFromDB: () => { },
    openAddSubcategoryModal: () => { },
    closeAddSubcategoryModal: () => { }
});

export const SubcategoryProvider = ({ categoryId, children }) => {
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
    const [isAddSubcategoryModalVisible, setIsAddSubcategoryModalVisible] = useState(false);

    function toggleSubcategorySelection(subcategoryId) {
        setSelectedSubcategories((prev) =>
            prev.includes(subcategoryId)
                ? prev.filter((id) => id !== subcategoryId)
                : [...prev, subcategoryId]
        );
    }

    async function fetchSubcategoriesFromDB() {
        setIsLoadingSubcategories(true);
        try {
            const res = await axiosPrivate.get(`/user/transactions/subcategories/${categoryId}`);
            if (res?.data?.subcategories) setSubcategories(res.data.subcategories);
            setSelectedSubcategories([]);
        } catch (error) {
            console.log("Error while fetching subcategories:", error);
        } finally {
            setIsLoadingSubcategories(false);
        }
    }

    function openAddSubcategoryModal() {
        setIsAddSubcategoryModalVisible(true);
    }

    function closeAddSubcategoryModal() {
        setIsAddSubcategoryModalVisible(false);
    }

    const currentSubcategoryContext = {
        subcategories,
        selectedSubcategories,
        isLoadingSubcategories,
        isAddSubcategoryModalVisible,
        toggleSubcategorySelection,
        fetchSubcategoriesFromDB,
        openAddSubcategoryModal,
        closeAddSubcategoryModal
    };

    return (
        <SubcategoryContext.Provider value={currentSubcategoryContext}>
            {children}
        </SubcategoryContext.Provider>
    );
};

export default SubcategoryContext;
