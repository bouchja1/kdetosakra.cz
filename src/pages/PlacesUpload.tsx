import { Button, Form, Input, InputNumber, Layout, Progress } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import firebase from 'firebase/compat/app';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useRef, useState } from 'react';

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
                            <h2>Pomoc připravit nový herní mód</h2>
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
                                <Form.Item
                                    label="Název místa"
                                    name="suggestedName"
                                    required
                                    rules={[{ required: true, message: 'lol' }]}
                                >
                                    <input
                                        type="text"
                                        className="ant-input text-input"
                                        placeholder="Název místa na fotce"
                                        ref={suggestInput}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Fotka"
                                    valuePropName="fileList"
                                    name="image"
                                    required
                                    rules={[{ required: true }]}
                                >
                                    <input type="file" />
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
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            width: '500px',
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
