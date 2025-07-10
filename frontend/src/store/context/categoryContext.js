import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const CategoryContext = createContext({
    categories: [],
    selectedCategories: [],
    isLoadingCategories: false,
    isAddCategoryModalVisible: false,
    isDeleteCategoryModalVisible: false,
    isDeleteSelectedCategoriesModalVisible: false,
    toggleCategorySelection: (categoryId) => { },
    fetchCategoriesFromDB: () => { },
    openAddCategoryModal: () => { },
    closeAddCategoryModal: () => { },
    openDeleteCategoryModal: () => { },
    closeDeleteCategoryModal: () => { },
    openDeleteSelectedCategoriesModal: () => { },
    closeDeleteSelectedCategoriesModal: () => { }
});

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
    const [isDeleteCategoryModalVisible, setIsDeleteCategoryModalVisible] = useState(false);
    const [isDeleteSelectedCategoriesModalVisible, setIsDeleteSelectedCategoriesModalVisible] = useState(false);

    function toggleCategorySelection(categoryId) {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((c) => c !== categoryId)
                : [...prev, categoryId]
        );
    }

    async function fetchCategoriesFromDB() {
        setIsLoadingCategories(true);
        try {
            const res = await axiosPrivate.get("/user/categories");
            if (res?.data?.categories) setCategories(res.data.categories);
            setSelectedCategories([]);
        } catch (error) {
            console.log("Error while fetching categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    }

    function openAddCategoryModal() {
        setIsAddCategoryModalVisible(true);
    }

    function closeAddCategoryModal() {
        setIsAddCategoryModalVisible(false);
    }

    function openDeleteCategoryModal() {
        setIsDeleteCategoryModalVisible(true);
    }

    function closeDeleteCategoryModal() {
        setIsDeleteCategoryModalVisible(false);
    }

    function openDeleteSelectedCategoriesModal() {
        setIsDeleteSelectedCategoriesModalVisible(true);
    }

    function closeDeleteSelectedCategoriesModal() {
        setIsDeleteSelectedCategoriesModalVisible(false);
    }

    const currentCategoryContext = {
        categories,
        selectedCategories,
        isLoadingCategories,
        isAddCategoryModalVisible,
        isDeleteCategoryModalVisible,
        isDeleteSelectedCategoriesModalVisible,
        toggleCategorySelection,
        fetchCategoriesFromDB,
        openAddCategoryModal,
        closeAddCategoryModal,
        openDeleteCategoryModal,
        closeDeleteCategoryModal,
        openDeleteSelectedCategoriesModal,
        closeDeleteSelectedCategoriesModal
    };

    return (
        <CategoryContext.Provider value={currentCategoryContext}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryContext;