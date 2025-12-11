import './FeatureItem.css';

interface FeatureItemProps {
    icon: string;
    title: string;
    description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
    return (
        <div className="feature-item">
            <img src={icon} alt={title} className="feature-icon" />
            <h3 className="feature-item-title">{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default FeatureItem;
