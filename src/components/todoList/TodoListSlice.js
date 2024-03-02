import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const todoListAdapters = createEntityAdapter();

const initialState = todoListAdapters.getInitialState({
    todoListLoadingStatus: 'idle'
})

export const fetchTodos = createAsyncThunk(
    'todoList/fetchTodos',
    async () => {
        const {request} = useHttp();
        return await request('https://dummyjson.com/todos');
    }
);

const todoList = createSlice({
    name: 'todoList',
    initialState,
    reducers: {
        todoListItemCreated: (state, action) => {todoListAdapters.addOne(state, action.payload)},
        todoListItemDeleted: (state, action) => {todoListAdapters.removeOne(state, action.payload)},
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, state => {state.todoListLoadingStatus = 'loading'})
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.todoListLoadingStatus = 'idle';
                todoListAdapters.setAll(state, action.payload);
            })
            .addCase(fetchTodos.rejected, state => {state.todoListLoadingStatus = 'error'})
            .addDefaultCase(() => {});
    }
});

const {action, reducer} = todoList;

export default reducer;

export const {
    todoListFetching,
    todoListFetched,
    todoListFetchingError,
    todoListItemCreated,
    todoListItemDeleted
} = actions;