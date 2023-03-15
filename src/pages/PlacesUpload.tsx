import { CoffeeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, Layout, Progress } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import firebase from 'firebase/compat/app';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { routeNames } from '../constants/routes';
import { SectionModesContainer } from '../containers/ModesOverview';
import MapyCzContext from '../context/MapyCzContext';
import { COLLECTION_PLACES, db, storage } from '../services/firebase';

const { Content } = Layout;

interface PlaceFormValues {
    description: string;
    latitude: number;
    longitude: number;
    suggestedName: string;
    image: React.BaseSyntheticEvent;
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export const PlacesUpload = () => {
    const [form] = Form.useForm();
    const suggestInput = useRef<any>();
    const mapyContext = useContext<any>(MapyCzContext);
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const [showUploadPlaceForm, setShowUploadPlaceForm] = useState(true);

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            const suggest = new mapyContext.SMap.Suggest(suggestInput.current);
            suggest.urlParams({
                // omezeni pro celou CR
                bounds: '48.5370786,12.0921668|51.0746358,18.8927040',
            });
            suggest
                .addListener('suggest', (suggestedData: any) => {
                    form.setFieldsValue({
                        suggestedName: suggestedData.place,
                        latitude: suggestedData?.data?.latitude?.toFixed(5) ?? 0,
                        longitude: suggestedData?.data?.longitude?.toFixed(5) ?? 0,
                    });
                })
                .addListener('close', (suggestedData: any) => {});
        }
    }, [mapyContext]);

    const handleSubmit = (values: PlaceFormValues) => {
        const { image, suggestedName, description, latitude, longitude } = values;
        const file = image.target?.files[0];

        if (!file) return;

        const fileMb = file.size / 1024 ** 2;

        if (fileMb > 20) {
            alert('Maximální povolená velikost fotky je 20 MB.');
            return;
        }

        const storageRef = ref(storage, `places/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            error => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => {
                        setImgUrl(downloadURL);
                        return db.collection(COLLECTION_PLACES).add({
                            created: firebase.firestore.FieldValue.serverTimestamp(),
                            suggestedName: suggestedName ?? '',
                            description: description ?? '',
                            latitude: latitude ?? null,
                            longitude: longitude ?? null,
                            image: downloadURL,
                        });
                    })
                    .then(res => {
                        setShowUploadPlaceForm(false);
                    })
                    .catch(err => {
                        alert(err);
                    });
            },
        );
    };

    return (
        <Content>
            <div className="about-container">
                <SectionModesContainer>
                    {showUploadPlaceForm ? (
                        <>
                            <h2>Poděl se o své fotky zajímavých míst v ČR</h2>
                            <p>
                                Milí výletníci. Rád bych vytvořil nový herní mód založený na poznávání zajímavých míst v
                                ČR na základě jejich fotek.
                            </p>
                            <p>
                                Pokud máte fotky, které jste ochotni sdílet a máte chuť pomoci s tvorbou nového herního
                                módu, neváhejte a nahrávejte prostřednictvím formuláře níže. Vítané jsou fotky všech
                                různých zajímavých míst, od nejznámějších turistických atrakcí (např.{' '}
                                <a href="https://www.google.com/search?q=hrad+karl%C5%A1tejn" target="_blank">
                                    Karlštejn
                                </a>
                                ) po místa méně známá (např.{' '}
                                <a href="https://www.google.com/search?q=helen%C4%8Diny+vodop%C3%A1dy" target="_blank">
                                    Helenčiny vodopády
                                </a>
                                ). Děkuji za pomoc a podporu.
                            </p>
                            <Form
                                className="placeUploadForm"
                                form={form}
                                labelAlign="left"
                                labelCol={{ span: 7 }}
                                wrapperCol={{ span: 17 }}
                                layout="horizontal"
                                onFinish={handleSubmit}
                                onFinishFailed={() => console.log('failed')}
                                size="large"
                            >
                                <Form.Item label="Název místa" name="suggestedName" required>
                                    <input
                                        type="text"
                                        className="ant-input text-input"
                                        placeholder="Zadejte název místa na fotce"
                                        ref={suggestInput}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Vaše fotka"
                                    valuePropName="fileList"
                                    name="image"
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vyberte prosím soubor s fotkou, kterou chcete nahrát.',
                                        },
                                    ]}
                                >
                                    <input type="file" accept="image/*" />
                                </Form.Item>
                                <Form.Item label="Zeměpisná šířka (lat)" name="latitude">
                                    <InputNumber
                                        style={{
                                            width: '200px',
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Zeměpisná délka (lon)" name="longitude">
                                    <InputNumber
                                        style={{
                                            width: '200px',
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Popis místa" name="description">
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item label="Autor místa" name="author">
                                    <Input placeholder="Tvé jméno nebo přezdívka" />
                                </Form.Item>
                                <Form.Item
                                    name="agreement"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value
                                                    ? Promise.resolve()
                                                    : Promise.reject(new Error('Odsouhlaste prosím podmínky.')),
                                        },
                                    ]}
                                    {...tailFormItemLayout}
                                >
                                    <Checkbox>
                                        Souhlasím s{' '}
                                        <Link target="_blank" to={`/${routeNames.podminky}`}>
                                            podmínkami používání
                                        </Link>
                                    </Checkbox>
                                </Form.Item>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        Nahrát
                                    </Button>
                                </div>
                            </Form>
                            {!imgUrl && progresspercent > 0 && <Progress percent={progresspercent} />}
                        </>
                    ) : (
                        <>
                            <h1>Díky!</h1>
                            <a
                                href="#"
                                onClick={() => {
                                    setShowUploadPlaceForm(true);
                                    // clear form
                                    form.resetFields();
                                }}
                            >
                                Nahrát další místo.
                            </a>
                        </>
                    )}
                </SectionModesContainer>
            </div>
        </Content>
    );
};
