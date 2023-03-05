import { Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React, { useState } from 'react';

export interface ImageUploadProps {
    onResponse?: (res: any) => void;
}

const ACCEPTED_IMAGE_FORMATS_ALL = ['image/jpeg', 'image/png', 'image/webp'];

export const ImageUpload = ({ onResponse }: ImageUploadProps) => {
    const [loading, setLoading] = useState(false);

    const uploadProps = {
        accept: ACCEPTED_IMAGE_FORMATS_ALL.join(','),
        data: (file: UploadFile) => {
            return {
                filename: file.uid,
                size: file.size,
                mime: file.type,
            };
        },
        action: `http://localhost:3001/upload`,
        headers: {
            authorization: 'authorization-text', // valida above IE 10
        },
        showUploadList: false,
        beforeUpload: (file: RcFile) => {
            const isSupportedImageType = ACCEPTED_IMAGE_FORMATS_ALL.includes(file.type);
            if (!isSupportedImageType) {
                console.log('UNSUPPORTED IMAGE TYPE');
            }
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                console.log('LARGER THAN 10 MB');
            }
            return isSupportedImageType && isLt10M;
        },
        onChange: (info: UploadChangeParam) => {
            if (info.file.status === 'uploading') {
                setLoading(true);
                return;
            }
            if (info.file.status === 'done') {
                console.log('UPLOADED: ', info.file.name);
                setLoading(false);
                console.log('RESPONSE: ', info.file.response);
                if (onResponse) {
                    onResponse(info.file.response);
                }
            }
            if (info.file.status === 'error') {
                console.log('ERROR');
                setLoading(false);
            }
        },
        // onRemove: () => onChange(''),
    };

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <div className="organisation-profile-image__container">
                <Upload {...uploadProps}>
                    <div>
                        <div style={{ marginTop: 8 }}>Nahrát</div>
                    </div>
                </Upload>
            </div>
        </div>
    );
};
