import { createContext, useCallback, useState } from "react";

const ContextMenuContext = createContext({
    checkIfContextMenuVisible: (type, id) => { },
    handleContextMenuToggle: (type, id) => { },
    handleCloseContextMenus: () => { }
});

export function ContextMenuProvider({ children }) {
    const [activeMenu, setActiveMenu] = useState(null);
    // { type: 'category' | 'subcategory', id: string } | null

    const handleContextMenuToggle = useCallback((type, id) => {
        setActiveMenu((prev) =>
            prev?.type === type && prev?.id === id ? null : { type, id }
        );
    }, []);

    const handleCloseContextMenus = useCallback(() => {
        setActiveMenu(null);
    }, []);

    const checkIfContextMenuVisible = useCallback(
        (type, id) => activeMenu?.type === type && activeMenu?.id === id,
        [activeMenu]
    );

    const currentContextMenuContext = {
        checkIfContextMenuVisible,
        handleContextMenuToggle,
        handleCloseContextMenus
    };
    return (
        <ContextMenuContext.Provider
            value={currentContextMenuContext}
        >
            {children}
        </ContextMenuContext.Provider>
    );
}

export default ContextMenuContext;
