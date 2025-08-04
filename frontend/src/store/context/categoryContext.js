import { createContext, useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";

const CategoryContext = createContext({
    categories: [],
    selectedCategories: [],
    isLoadingCategories: false,
    isAddCategoryModalVisible: false,
    isDeleteSelectedCategoriesModalVisible: false,
    subcategoryMapping: [],
    isLoadingSubcategoryMapping: false,
    fetchCategoriesFromDB: () => { },
    fetchSubcategoryMappingFromDB: () => { },
    getSubcategoriesForCategory: (categoryId) => { },
    handleToggleCategorySelection: (categoryId) => { },
    handleOpenAddCategoryModal: () => { },
    handleCloseAddCategoryModal: () => { },
    handleOpenDeleteSelectedCategoriesModal: () => { },
    handleCloseDeleteSelectedCategoriesModal: () => { }
});

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
    const [isDeleteSelectedCategoriesModalVisible, setIsDeleteSelectedCategoriesModalVisible] = useState(false);
    const [subcategoryMapping, setSubcategoryMapping] = useState([]);
    const [isLoadingSubcategoryMapping, setIsLoadingSubcategoryMapping] = useState(false);

    useEffect(() => {
        fetchCategoriesFromDB();
        fetchSubcategoryMappingFromDB();
    }, []);

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

    async function fetchSubcategoryMappingFromDB() {
        setIsLoadingSubcategoryMapping(true);
        try {
            const res = await axiosPrivate.get("/user/subcategories");
            if (res?.data?.groupedSubcategories) setSubcategoryMapping(res.data.groupedSubcategories);
        } catch (error) {
            console.log("Error while fetching subcategory mapping:", error);
        } finally {
            setIsLoadingSubcategoryMapping(false);
        }
    }

    function getSubcategoriesForCategory(categoryId) {
        if (!categoryId || isLoadingSubcategoryMapping) return [];
        const categoryName = categories.filter((cat) => cat._id === categoryId)?.[0]
            ?.name;
        if (!categoryName) return [];
        return subcategoryMapping?.[categoryName] || [];
    };

    function handleToggleCategorySelection(categoryId) {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((c) => c !== categoryId)
                : [...prev, categoryId]
        );
    }

    function handleOpenAddCategoryModal() {
        setIsAddCategoryModalVisible(true);
    }

    function handleCloseAddCategoryModal() {
        setIsAddCategoryModalVisible(false);
    }

    function handleOpenDeleteSelectedCategoriesModal() {
        setIsDeleteSelectedCategoriesModalVisible(true);
    }

    function handleCloseDeleteSelectedCategoriesModal() {
        setIsDeleteSelectedCategoriesModalVisible(false);
    }

    const currentCategoryContext = {
        categories,
        selectedCategories,
        isLoadingCategories,
        isAddCategoryModalVisible,
        isDeleteSelectedCategoriesModalVisible,
        subcategoryMapping,
        isLoadingSubcategoryMapping,
        fetchCategoriesFromDB,
        fetchSubcategoryMappingFromDB,
        getSubcategoriesForCategory,
        handleToggleCategorySelection,
        handleOpenAddCategoryModal,
        handleCloseAddCategoryModal,
        handleOpenDeleteSelectedCategoriesModal,
        handleCloseDeleteSelectedCategoriesModal,
    };

    return (
        <CategoryContext.Provider value={currentCategoryContext}>
            {children}
        </CategoryContext.Provider>
    );
};

export default CategoryContext;