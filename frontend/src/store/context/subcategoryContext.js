import { createContext, useState } from "react";
import { toast } from "react-toastify";

import { axiosPrivate } from "../../api/axios";

const SubcategoryContext = createContext({
    subcategories: [],
    isLoadingSubcategories: false,
    isAddSubcategoryModalVisible: false,
    fetchSubcategoriesFromDB: async () => { },
    handleOpenAddSubcategoryModal: () => { },
    handleCloseAddSubcategoryModal: () => { }
});

export const SubcategoryProvider = ({ categoryId, children }) => {
    const [subcategories, setSubcategories] = useState([]);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
    const [isAddSubcategoryModalVisible, setIsAddSubcategoryModalVisible] = useState(false);

    async function fetchSubcategoriesFromDB() {
        setIsLoadingSubcategories(true);
        try {
            const res = await axiosPrivate.get(`/user/subcategories/${categoryId}`);
            if (res?.data?.subcategories) setSubcategories(res.data.subcategories);
        } catch (error) {
            toast.error(`Error occured while fetching subcategories: ${error.message}`, {
                autoClose: 5000,
                position: "top-center"
            });
        } finally {
            setIsLoadingSubcategories(false);
        }
    }

    function handleOpenAddSubcategoryModal() {
        setIsAddSubcategoryModalVisible(true);
    }

    function handleCloseAddSubcategoryModal() {
        setIsAddSubcategoryModalVisible(false);
    }

    const currentSubcategoryContext = {
        subcategories,
        isLoadingSubcategories,
        isAddSubcategoryModalVisible,
        fetchSubcategoriesFromDB,
        handleOpenAddSubcategoryModal,
        handleCloseAddSubcategoryModal
    };

    return (
        <SubcategoryContext.Provider value={currentSubcategoryContext}>
            {children}
        </SubcategoryContext.Provider>
    );
};

export default SubcategoryContext;
