import { createContext, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const CategoryContext = createContext({
    categories: [],
    selectedCategories: [],
    isLoadingCategories: false,
    showAddCategoryModal: false,
    showDeleteCategoryModal: false,
    showDeleteSelectedCategoriesModal: false,
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
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
    const [showDeleteSelectedCategoriesModal, setShowDeleteSelectedCategoriesModal] = useState(false);

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
            const res = await axiosPrivate.get("/user/transactions/categories");
            if (res?.data?.categories) setCategories(res.data.categories);
            setSelectedCategories([]);
        } catch (error) {
            console.log("Error while fetching categories:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    }

    function openAddCategoryModal() {
        setShowAddCategoryModal(true);
    }

    function closeAddCategoryModal() {
        setShowAddCategoryModal(false);
    }

    function openDeleteCategoryModal() {
        setShowDeleteCategoryModal(true);
    }

    function closeDeleteCategoryModal() {
        setShowDeleteCategoryModal(false);
    }

    function openDeleteSelectedCategoriesModal() {
        setShowDeleteSelectedCategoriesModal(true);
    }

    function closeDeleteSelectedCategoriesModal() {
        setShowDeleteSelectedCategoriesModal(false);
    }

    const currentCategoryContext = {
        categories,
        selectedCategories,
        isLoadingCategories,
        showAddCategoryModal,
        showDeleteCategoryModal,
        showDeleteSelectedCategoriesModal,
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