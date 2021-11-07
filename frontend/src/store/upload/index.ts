import { createActions, createReducer } from "reduxsauce";
import { Actions, AddUploadAction, RemoveUploadAction, SetUploadErrorAction, UpdateProgressAction, UploadState } from "./types";
import update from 'immutability-helper';

export const { Types, Creators } = createActions<{
    ADD_UPLOAD: string;
    REMOVE_UPLOAD: string;
    UPDATE_PROGRESS: string;
    SET_UPLOAD_ERROR: string;
},
    {
        addUpload(payload: AddUploadAction['payload']): AddUploadAction
        removeUpload(payload: RemoveUploadAction['payload']): RemoveUploadAction
        updateProgress(payload: UpdateProgressAction['payload']): UpdateProgressAction
        setUploadError(payload: SetUploadErrorAction['payload']): SetUploadErrorAction
    }>({
        addUpload: ['payload'],
        removeUpload: ['payload'],
        updateProgress: ['payload'],
        setUploadError: ['payload']
    }
    );
export const INITIAL_STATE: UploadState = {
    uploads: []
};

const reducer = createReducer<UploadState, Actions>(INITIAL_STATE, {
    [Types.ADD_UPLOAD]: addUpload as any,
    [Types.REMOVE_UPLOAD]: removeUpload as any,
    [Types.UPDATE_PROGRESS]: updateProgress as any,
    [Types.SET_UPLOAD_ERROR]: setUploadError as any,
});

export default reducer;

function findIndexUpload(state: UploadState, id: string) {
    return state.uploads.findIndex(upload => upload.video.id === id);
}

function findIndexFile(files: Array<{ fileField }>, fileField: string) {
    return files.findIndex(file => file.fileField === fileField);
}

function findIndexUploadAndFile(state: UploadState, videoId: string, fileField: string): { indexUpload?, indexFile?} {

    const indexUpload = findIndexUpload(state, videoId);

    if (indexUpload === -1) {
        return {};
    }

    const upload = state.uploads[indexUpload];
    const indexFile = findIndexFile(upload.files, fileField);


    return indexFile === -1 ? {} : { indexUpload, indexFile };

}

function calculateGlobalProgress(files: Array<{ progress }>) {
    const countFiles = files.length;

    if (!countFiles) {
        return 0;
    }

    const sumProgress = files.reduce((sum, file) => sum + file.progress, 0);

    return sumProgress / countFiles;
}

function addUpload(state = INITIAL_STATE, action: AddUploadAction): UploadState {
    if (action.payload.files.length === 0) {
        return state;
    }
    const index = findIndexUpload(state, action.payload.video.id);

    /** upload ainda em progresso */
    if (index !== -1 && state.uploads[index].progress < 1) {
        return state;
    }

    /** remove o video caso ele já exista como concluido */
    const uploads = index === -1 ? state.uploads : update(state.uploads, {
        $splice: [[index, 1]]
    });

    return {
        uploads: [
            ...uploads,
            {
                video: action.payload.video,
                progress: 0,
                files: action.payload.files.map(file => ({
                    fileField: file.fileField,
                    filename: file.file.name,
                    progress: 0
                }))
            }
        ]
    }
}

function removeUpload(state = INITIAL_STATE, action: RemoveUploadAction): UploadState {
    //ao ter leva muito grande de uploads, filter não é adequado, por ser pouco performatico
    //
    const uploads = state.uploads.filter(upload => upload.video.id !== action.payload.id);

    /** evita mudança de estado desnecessária caso nao consiga excluir */
    if (uploads.length === state.uploads.length) {
        return state;
    }
    return {
        uploads: uploads
    }
}

function updateProgress(state: UploadState = INITIAL_STATE, action: UpdateProgressAction): UploadState {

    const videoId = action.payload.video.id;
    const fileField = action.payload.fileField;
    const { indexUpload, indexFile } = findIndexUploadAndFile(state, videoId, fileField);

    if (typeof indexUpload === "undefined") {
        return state;
    }

    const upload = state.uploads[indexUpload];
    const file = upload.files[indexFile];

    /** evita atualizar o progress de um video que já foi dado como concluido
     *  seja com sucesso, ou erro
     * */
    if (file.progress === action.payload.progress) {
        return state;
    }

    const uploads = update(state.uploads, {
        [indexUpload]: {
            $apply(upload) {
                const files = update(upload.files, {
                    [indexFile]: {
                        $set: { ...file, progress: action.payload.progress }
                    }
                });
                const progress = calculateGlobalProgress(files);
                return { ...upload, progress, files }
            }
        }
    });

    return { uploads };
}

function setUploadError(state = INITIAL_STATE, action: SetUploadErrorAction): UploadState {
    const videoId = action.payload.video.id;
    const fileField = action.payload.fileField;

    const { indexUpload, indexFile } = findIndexUploadAndFile(state, videoId, fileField);

    if (typeof indexUpload === "undefined") {
        return state;
    }

    const upload = state.uploads[indexUpload];
    const file = upload.files[indexFile];

    const uploads = update(state.uploads, {
        [indexUpload]: {
            files: {
                [indexFile]: {
                    $set: { ...file, error: action.payload.error, progress: 1 }
                }
            }
        }
    });

    return { uploads };
}