export const updateCartCount = (userId) => async (dispatch) => {
    try {
        const response = await fetch(`${apiBaseURL}/api/user/${userId}/cart-count`);
        if (response.ok) {
            const { count } = await response.json();
            dispatch({
                type: 'UPDATE_CART_COUNT',
                payload: count,
            });
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
};