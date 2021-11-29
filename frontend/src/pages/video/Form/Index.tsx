import * as React from 'react';
import { createRef, MutableRefObject, useEffect, useRef, useState, useContext, useCallback } from 'react';

import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router-dom';

import { omit, zipObject } from 'lodash';
import { useSnackbar } from "notistack";

import { Checkbox, FormControlLabel, Grid, TextField, Theme, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormHelperText from "@material-ui/core/FormHelperText";

import * as yup from '../../../util/vendor/yup';
import { Video, VideoFileFieldsMap } from "../../../util/models";
import videoHttp from "../../../util/http/video-http";
import SubmitActions from "../../../components/SubmitActions";
import { DefaultForm } from "../../../components/DefaultForm";
import LoadingContext from "../../../components/Loading/LoadingContext";
import { InputFileComponent } from "../../../components/InputFile";
import SnackbarUpload from "../../../components/SnackbarUpload";
import useSnackbarFormError from "../../../hooks/useSnackbarFormError";
import { RouteParams } from '../../../interfaces/RouteParams';

import { RatingField } from "./RatingField";
import { UploadField } from "./UploadField";
import GenreField, { GenreFieldComponent } from "./GenreField";
import CategoryField, { CategoryFieldComponent } from "./CategoryField";
import { CastMemberField, CastMemberFieldComponent } from "./CastMemberField";

const useStyles = makeStyles((theme: Theme) => ({
    cardUpload: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        margin: theme.spacing(2, 0)
    },
    cardOpened: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
    },
    cardContentOpened: {
        paddingBottom: theme.spacing(2) + 'px !important'
    }
}));

const validationSchema = yup.object().shape({
    title: yup.string()
        .label("Título")
        .required()
        .max(255),
    description: yup.string()
        .label("Sinopse")
        .required(),
    year_launched: yup.number()
        .label('Ano de lançamento')
        .required()
        .min(1),
    duration: yup.number()
        .label("Duração")
        .required()
        .min(1),
    rating: yup.string()
        .label("Classificação")
        .required(),
    genres: yup.array()
        .label("Gêneros")
        .required()
        .test({
            message: "Cada gênero escolhido precisa ter pelo menos uma categoria selecionada",
            test(value) {
                return value.every(
                    (v: any) => v.categories.filter(
                        (cat: any) => this.parent.categories.map((c: any) => c.id).includes(cat.id)
                    ).length !== 0
                );
            }
        }),
    categories: yup.array()
        .label("Categorias")
        .required(),
    cast_members: yup.array()
        .label("Membros de elenco")
        .required(),

});

const fileFields = Object.keys(VideoFileFieldsMap);
const Index = () => {

    const { register, handleSubmit, getValues, setValue,
        watch, reset, errors, triggerValidation, formState } = useForm({
            validationSchema,
            defaultValues: {
                rating: '',
                opened: false,
                genres: [],
                categories: [],
                cast_members: []
            }
        });

    useSnackbarFormError(formState.submitCount, errors);

    const { id } = useParams<RouteParams>();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const [video, setVideo] = useState<Video | null>(null);
    const loading = useContext(LoadingContext);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
    const castMemberRef = useRef() as MutableRefObject<CastMemberFieldComponent>;
    const categoriesRef = useRef() as MutableRefObject<CategoryFieldComponent>;
    const genresRef = useRef() as MutableRefObject<GenreFieldComponent>;
    const uploadRef = useRef(
        zipObject(fileFields, fileFields.map(() => createRef()))
    ) as MutableRefObject<{ [key: string]: MutableRefObject<InputFileComponent> }>;

    useEffect(() => {
        [
            'rating',
            'opened',
            'genres',
            'categories',
            'cast_members',
            ...fileFields
        ].forEach(name => register({ name: name }))
    }, [register]);

    useEffect(() => {

        enqueueSnackbar("", {
            key: "snackbar-upload",
            persist: true,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "right"
            },
            content: (
                (key, message) => {
                    const id = key as any;
                    return <SnackbarUpload id={id} />
                }
            )
        });

        if (!id) {
            return;
        }

        (async function getVideo() {

            try {
                const { data } = await videoHttp.get(id);
                setVideo(data.data);
                reset(data.data);
            } catch (e) {
                enqueueSnackbar("Não foi possível carregar as informações", { variant: "error" });
            }

        })();
    }, [enqueueSnackbar, id, reset]);

    async function onSubmit(formData: any, event: any ) {

        const sendData = omit(formData, ['cast_members', 'genres', 'categories']);
        sendData['cast_members_id'] = formData['cast_members'].map((cast_member: any) => cast_member.id);
        sendData['genres_id'] = formData['genres'].map((genre: any) => genre.id);
        sendData['categories_id'] = formData['categories'].map((category: any) => category.id);

        try {
            const http = !video
                ? videoHttp.create(sendData)
                : videoHttp.update(video.id, { ...sendData, _method: 'PUT' }, { http: { usePost: true } });
            const { data } = await http;
            enqueueSnackbar('Vídeo salvo com sucesso!', { variant: "success" });

            id && resetForm(video);
            event
                ? (
                    id
                        ? history.replace(`/videos/${data.data.id}/edit`)
                        : history.push(`/videos/${data.data.id}/edit`)
                )
                : history.push('/videos');

        } catch (e) {
            enqueueSnackbar("Não foi possível salvar as informações", { variant: "error" });
        }

    }

    const resetForm = useCallback((data) => {
        
        Object.keys(uploadRef.current).forEach(
            field => uploadRef.current[field].current.clear()
        );

        castMemberRef.current.clear();
        categoriesRef.current.clear();
        genresRef.current.clear();
        reset(data);

    }, [castMemberRef, categoriesRef, genresRef, uploadRef]);

    function validateSubmit() {
        triggerValidation()
            .then(isValid => {
                isValid && onSubmit(getValues(), null)
            });
    }


    const classes = useStyles();
    return (

        <DefaultForm 
            GridItemProps={{ xs: 12 }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name={"title"}
                        label={"Título"}
                        variant={"outlined"}
                        fullWidth
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        error={(errors as any).title !== undefined}
                        helperText={(errors as any).title && (errors as any).title.message}

                    />

                    <TextField
                        name={"description"}
                        label={"Sinopse"}
                        multiline
                        rows="4"
                        margin="normal"
                        variant={"outlined"}
                        fullWidth
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        error={(errors as any).description !== undefined}
                        helperText={(errors as any).description && (errors as any).description.message}

                    />

                    <Grid container spacing={1}>
                        <Grid item xs={6}>

                            <TextField
                                name={"year_launched"}
                                label={"Ano de lançamento"}
                                type={"number"}
                                margin="normal"
                                variant={"outlined"}
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={(errors as any).year_launched !== undefined}
                                helperText={(errors as any).year_launched && (errors as any).year_launched.message}

                            />

                        </Grid>

                        <Grid item xs={6}>

                            <TextField
                                name={"duration"}
                                label={"Duraçāo"}
                                type={"number"}
                                margin="normal"
                                variant={"outlined"}
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={(errors as any).duration !== undefined}
                                helperText={(errors as any).duration && (errors as any).duration.message}

                            />

                        </Grid>
                    </Grid>

                    <CastMemberField
                        ref={castMemberRef}
                        error={errors.cast_members}
                        castMembers={watch('cast_members') as any[]}
                        setCastMembers={(value: any) => setValue('cast_members', value, true)}
                        disabled={loading}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <GenreField
                                ref={genresRef}
                                error={errors.genres}
                                genres={watch('genres') as any[]}
                                categories={watch('categories') as any[]}
                                setGenres={(value: any) => setValue('genres', value, true)}
                                setCategories={(value: any) => setValue('categories', value, true)}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CategoryField
                                ref={categoriesRef}
                                error={errors.categories}
                                categories={watch('categories') as any[]}
                                setCategories={(vale) => setValue('categories', vale, true)}
                                genres={watch('genres') as any[]}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText>
                                Escolha os gêneros do vídeo
                            </FormHelperText>
                            <FormHelperText>
                                Escolha pelo menos uma categoria de cada gênero
                            </FormHelperText>
                            <FormHelperText>
                                As categorias devem estar relacionadas com no mínimo um gênero
                            </FormHelperText>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating') + ""}
                        setValue={(value) => setValue('rating', value, true)}
                        error={errors.rating}
                        disabled={loading}
                        FormControlProps={{ margin: isGreaterMd ? 'none' : 'normal' }}
                    />
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color={"primary"} variant={"h6"}>Imagens</Typography>

                            <UploadField
                                ref={uploadRef.current['thumb_file']}
                                label={"Thumb"}
                                accept={"image/*"}
                                setValue={(value => setValue('thumb_file', value))}
                                error={null}
                                disabled={loading} />

                            <UploadField
                                ref={uploadRef.current['banner_file']}
                                label={"Banner"}
                                accept={"image/*"}
                                setValue={(value => setValue('banner_file', value))}
                                error={null}
                                disabled={loading} />
                        </CardContent>
                    </Card>
                    <Card className={classes.cardUpload}>
                        <CardContent>
                            <Typography color={"primary"} variant={"h6"}>Vídeos</Typography>
                            <UploadField
                                ref={uploadRef.current['trailer_file']}
                                label={"Trailer"}
                                accept={"video/mp4"}
                                setValue={(value => setValue('trailer_file', value))}
                                error={null}
                                disabled={loading} />

                            <UploadField
                                ref={uploadRef.current['video_file']}
                                label={"Vídeo"}
                                accept={"video/mp4"}
                                setValue={(value => setValue('video_file', value))}
                                error={null}
                                disabled={loading} />
                        </CardContent>
                    </Card>

                    <Card className={classes.cardOpened}>
                        <CardContent className={classes.cardContentOpened}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={"opened"}
                                        color={"primary"}
                                        onChange={() => {
                                            setValue('opened', !getValues()['opened']);
                                        }}
                                        checked={watch('opened') as boolean}
                                        disabled={loading}
                                    />
                                }
                                label={
                                    <Typography color="primary" variant="subtitle2">
                                        Quero que este conteúdo apareça na seçāo de lançamentos
                                    </Typography>
                                }
                                labelPlacement={"end"}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <SubmitActions disableButtons={false} handleSave={validateSubmit} />
        </DefaultForm>
    );
};

export default Index;